import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

interface Group {
  id: number;
  name: string;
  channels: Channel[];
  users: User[];
}

interface Channel {
  name: string;
  users: User[];
}

interface User {
  username: string;
  role?: string;
  groups?: string[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messagecontent: string = '';
  messages: string[] = [];
  userRole: string | null = '';
  username: string | null = '';

  newGroupName: string = '';
  newChannelName: string = '';
  selectedGroup: Group | null = null;
  selectedChannel: Channel | null = null;
  userToAdd: string | null = ''; 
  
  groups: Group[] = [];
  userChannels: Channel[] = []; 
  users: User[] = [];
  isCreatingChannel: boolean = false;

  constructor(private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.userRole = currentUser.role;
    this.username = currentUser.username;
  
    if (!this.userRole) {
      this.router.navigate(['/login']);
    }

    this.groups = JSON.parse(localStorage.getItem('groups') || '[]');
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.userChannels = this.getUserChannels();
  }

  getUserChannels(): Channel[] {
    const channels: Channel[] = [];
    this.groups.forEach(group => {
      group.channels.forEach(channel => {
        if (channel.users.some(user => user.username === this.username)) {
          channels.push(channel);
        }
      });
    });
    return channels;
  }

  selectGroup(group: Group): void {
    this.selectedGroup = group;
    this.selectedChannel = null; 
  }

  selectChannel(channel: Channel): void {
    if (this.username) {
      if (this.userRole === 'SuperAdmin' || this.userRole === 'GroupAdmin') {
        if (!channel.users.some(user => user.username === this.username)) {
          channel.users.push({ username: this.username });
          this.saveGroups();
        }
      }

      this.selectedChannel = channel;
      this.socketService.joinChannel(channel.name, this.username);

      this.messages = [];

      this.socketService.getChatHistory((history: any[]) => {
        const sortedHistory = history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.messages = sortedHistory.slice(0, 5).map(msg => `${msg.user}: ${msg.message}`);
      });

      this.socketService.getMessages((message: any) => {
        this.messages.unshift(`${message.user}: ${message.message}`);
      });
    }
  }
  
  
  sendMessage(): void {
    if (this.messagecontent.trim() && this.selectedChannel) {
      this.socketService.sendMessage(this.selectedChannel.name, this.messagecontent, this.username);
      this.messagecontent = '';
    }
  }


  createGroup(): void {
    if (this.newGroupName.trim()) {
      const groupExists = this.groups.some(group => group.name.toLowerCase() === this.newGroupName.trim().toLowerCase());
      if (groupExists) {
        alert('A group with this name already exists. Please choose a different name.');
        return;
      }
  
      const newGroup: Group = {
        id: Date.now(),
        name: this.newGroupName.trim(),
        channels: [],
        users: [{ username: this.username || '' }] 
      };
      this.groups.push(newGroup);
      this.saveGroups();
      this.newGroupName = ''; 
    }
  }
  
  

  createChannel(): void {
    if (this.selectedGroup && this.newChannelName.trim()) {
      const channelExists = this.selectedGroup.channels.some(channel => channel.name.toLowerCase() === this.newChannelName.trim().toLowerCase());
      if (channelExists) {
        alert('A channel with this name already exists in this group. Please choose a different name.');
        return;
      }
  
      const newChannel: Channel = {
        name: this.newChannelName.trim(),
        users: []
      };
      this.selectedGroup.channels.push(newChannel);
      this.saveGroups();
      this.newChannelName = ''; 
      this.isCreatingChannel = false; 
    }
  }
  

  addUserToChannel(): void {                             
    if (this.selectedChannel && this.userToAdd) {
      const user = this.users.find(u => u.username === this.userToAdd);
      if (user) {
        if (!this.selectedChannel.users.some(u => u.username === user.username)) {
          this.selectedChannel.users.push(user);
          this.saveGroups();
          alert(`${user.username} has been added to the channel.`);
        } else {
          alert(`${user.username} is already in this channel.`);
        }
      }
    }
  }

  removeGroup(group: Group): void {
    this.groups = this.groups.filter(g => g !== group);
    this.saveGroups();
    this.selectedGroup = null; 
  }

  removeChannel(group: Group, channel: Channel): void {
    group.channels = group.channels.filter(c => c !== channel);
    this.saveGroups(); 
    
    this.socketService.deleteChannel(channel.name); 
    
    if (this.selectedChannel === channel) {
      this.messages = [];
      this.selectedChannel = null;
    }
  }
  
  removeUserFromChannel(user: User): void {
    if (this.selectedChannel) {
      this.selectedChannel.users = this.selectedChannel.users.filter(u => u !== user);
      this.saveGroups();
    }
  }

  banUserFromChannel(user: User): void {            
    this.removeUserFromChannel(user);
    alert(`${user.username} has been banned from the channel.`);
  }

  saveGroups(): void {
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users = users.filter((user: any) => user.username !== this.username);

      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.removeItem('currentUser');

      alert('Your profile has been deleted.');
      this.router.navigate(['/login']);
    }
  }
}


//working
