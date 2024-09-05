import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

interface Group {                   //interface for group
  id: number;                       //id of group
  name: string;                     //name of group
  channels: Channel[];              //channels in group
  users: User[];                    //users in group
}

interface Channel {                 //interface for channel
  name: string;                     //name of channel
  users: User[];                    //users in channel
}

interface User {                    //interface for user
  username: string;                 //username of user
  role?: string;                    //role of user optional
  groups?: string[];                //groups of user optional
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {      
  messagecontent: string = '';            //empty string for message content
  messages: string[] = [];                //empty array for messages  
  userRole: string | null = '';           //empty string for user role
  username: string | null = '';           //empty string for username

  newGroupName: string = '';              //empty string for new group name
  newChannelName: string = '';            //empty string for new channel name
  selectedGroup: Group | null = null;     //empty group for selected group
  selectedChannel: Channel | null = null; //empty channel for selected channel
  userToAdd: string | null = '';          //empty string for user to add
  
  groups: Group[] = [];                   //empty array for groups     
  userChannels: Channel[] = [];           //empty array for user channels   
  users: User[] = [];                     //empty array for users   
  isCreatingChannel: boolean = false;     //boolean for creating channel set to false to avoid creating channel by default

  constructor(private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {

    //get current user from session storage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    //get user role and username
    this.userRole = currentUser.role;
    this.username = currentUser.username;
    
    //if user role is not present then navigate to login page
    if (!this.userRole) {
      this.router.navigate(['/login']);
    }

    //get groups, users and user channels from local storage
    this.groups = JSON.parse(localStorage.getItem('groups') || '[]');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.userChannels = this.getUserChannels();
  }
  
  getUserChannels(): Channel[] {                          //function to get user channels
    const channels: Channel[] = [];                       //empty array for channels
    this.groups.forEach(group => {                        //loop through groups
      group.channels.forEach(channel => { //loop through channels within group
        //check if user is present in channel users array using some method which returns true if user is present
        if (channel.users.some(user => user.username === this.username)) {  
          channels.push(channel);                         //push channel to channels array
        }
      });
    });
    return channels;                                      //return channels array
  }

  selectGroup(group: Group): void {                       //function to select group
    this.selectedGroup = group;                           //set selected group to group
    this.selectedChannel = null;                          //set selected channel to null
  }

  selectChannel(channel: Channel): void {                 //function to select channel
    if (this.username) {                                  //check if username is present 
      if (this.userRole === 'SuperAdmin' || this.userRole === 'GroupAdmin') {   //check if user role is superadmin or groupadmin
        if (!channel.users.some(user => user.username === this.username)) {     //check if user is not present in channel users array
          channel.users.push({ username: this.username });                      //push user to channel users array
          this.saveGroups();                                                    //save groups            
        }
      }

      this.selectedChannel = channel;                                           //set selected channel to channel            
      this.socketService.joinChannel(channel.name, this.username);              //join channel using socket service

      this.messages = [];                                                       //empty messages array            

      this.socketService.getChatHistory((history: any[]) => {                   //get chat history using socket service      
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());  //sort history by timestamp
        this.messages = sortedHistory.slice(0, 5).map(msg => `${msg.user}: ${msg.message}`);  //get last 5 messages
      });

      this.socketService.getMessages((message: any) => {                        //get messages using socket service
        this.messages.unshift(`${message.user}: ${message.message}`);           //add message to messages array
      });
    }
  }
  
  sendMessage(): void {                                                         //function to send message
    if (this.messagecontent.trim() && this.selectedChannel) {                   //check if message content is present and selected channel is present
      this.socketService.sendMessage(this.selectedChannel.name, this.messagecontent, this.username);  //send message using socket service
      this.messagecontent = '';                                                 //empty message content
    }
  }

  
  createGroup(): void {                                                         //function to create group
    if (this.newGroupName.trim()) {                                             //check if new group name is present
      const groupExists = this.groups.some(group => group.name.toLowerCase() === this.newGroupName.trim().toLowerCase()); //check if group exists
      if (groupExists) {                                                        //if group exists
        alert('A group with this name already exists across all groups. Please choose a different name.');  //alert message
        return; 
      }
  
      const newGroup: Group = {                                                 //create new group with unique id
        id: Date.now(),                                                         //set id to current date
        name: this.newGroupName.trim(),                                         //set name to new group name
        channels: [],                                                           //empty channels array
        users: [{ username: this.username || '' }]                              //add user to users array
      };
      this.groups.push(newGroup);                                               //push new group to groups array
      this.saveGroups();                                                        //save groups 
      this.newGroupName = '';                                                   //empty new group name
    }
  }

  
  createChannel(): void {                                                       //function to create channel
    if (this.selectedGroup && this.newChannelName.trim()) {                     //check if selected group and new channel name is present
      const channelExists = this.groups.some(group =>                           //check if channel exists
        group.channels.some(channel => channel.name.toLowerCase() === this.newChannelName.trim().toLowerCase())   //check if channel name exists
      );
      if (channelExists) {                                                     //if channel exists
        alert('A channel with this name already exists across all groups. Please choose a different name.');    //alert message
        return;
      }
  
      const newChannel: Channel = {                                            //create new channel
        name: this.newChannelName.trim(),                                      //set name to new channel name
        users: []                                                              //empty users array
      };
      this.selectedGroup.channels.push(newChannel);                            //push new channel to selected group channels array
      this.saveGroups();                                                       //save groups
      this.newChannelName = '';                                                //empty new channel name         
      this.isCreatingChannel = false;                                          //set is creating channel to false        
    }
  }

  addUserToChannel(): void {                                                  //function to add user to channel
    if (this.selectedChannel && this.userToAdd) {                             //check if selected channel and user to add is present
      const user = this.users.find(u => u.username === this.userToAdd);       //find user from users array
      if (user) {                                                             //if user is present           
        if (!this.selectedChannel.users.some(u => u.username === user.username)) {    //check if user is not present in selected channel users array
          this.selectedChannel.users.push(user);                              //push user to selected channel users array          
          this.saveGroups();                                                  //save groups       
          alert(`${user.username} has been added to the channel.`);           //alert message
        } else {
          alert(`${user.username} is already in this channel.`);              //alert message
        }
      }
    }
  }

  removeGroup(group: Group): void {                                           //function to remove group
    this.groups = this.groups.filter(g => g !== group);                       //filter groups array
    this.saveGroups();                                                        //save groups       
    this.selectedGroup = null;                                                //set selected group to null  
  }

  removeChannel(group: Group, channel: Channel): void {                       //function to remove channel   
    group.channels = group.channels.filter(c => c !== channel);               //filter channels array     
    this.saveGroups();                                                        //save groups 
    
    this.socketService.deleteChannel(channel.name);                           //delete channel using socket service  
    
    if (this.selectedChannel === channel) {                                   //check if selected channel is channel       
      this.messages = [];                                                     //empty messages array  
      this.selectedChannel = null;                                            //set selected channel to null
    }
  }

  removeUserFromChannel(user: User): void {                                   //function to remove user from channel
    if (this.selectedChannel) {                                               //check if selected channel is present
      this.selectedChannel.users = this.selectedChannel.users.filter(u => u !== user);  //filter users array    
      this.saveGroups();                                                      //save groups   
    }
  }

  banUserFromChannel(user: User): void {                                      //function to ban user from channel         
    this.removeUserFromChannel(user);                                         //remove user from channel  
    alert(`${user.username} has been banned from the channel.`);              //alert message     
  }

  saveGroups(): void {                                                        //function to save groups  
    localStorage.setItem('groups', JSON.stringify(this.groups));              //set groups to local storage     
  }

  saveUsers(): void {                                                         //function to save users    
    localStorage.setItem('users', JSON.stringify(this.users));                //set users to local storage  
  }

  logout(): void {                                                            //function to logout  
    sessionStorage.removeItem('currentUser');                                 //remove current user from session storage  
    this.router.navigate(['/login']);                                         //navigate to login page
  }

  deleteProfile(): void {                                                     //function to delete profile
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) { //confirm message 
      let users = JSON.parse(localStorage.getItem('users') || '[]');          //get users from local storage  
      users = users.filter((user: any) => user.username !== this.username);   //filter users array  

      localStorage.setItem('users', JSON.stringify(users));                   //set users to local storage  
      sessionStorage.removeItem('currentUser');                               //remove current user from session storage    

      alert('Your profile has been deleted.');                                //alert message   
      this.router.navigate(['/login']);                                       //navigate to login page  
    }
  }
}


