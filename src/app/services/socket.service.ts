import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'                                             // provide this service at root level    
})
export class SocketService {
  private socket: Socket;                                       // socket object 

  constructor() {
    this.socket = io('http://localhost:3000');                  // connect to the server
  }

  joinChannel(channelName: string, name: string): void {        // join a channel
    this.socket.emit('joinChannel', channelName);               // emit joinChannel event
  }

  sendMessage(channelName: string, message: string, user: string | null): void {    // send a message
    this.socket.emit('sendMessage', { channelName, message, user });                // emit sendMessage event
  }

  getMessages(next: (message: any) => void): void {             // get messages 
    this.socket.off('newMessage');                              // remove previous event listener
    this.socket.on('newMessage', (message) => next(message));   // listen for newMessage event
  }

  getChatHistory(next: (history: any[]) => void): void {        // get chat history
    this.socket.off('chatHistory');                             // remove previous event listener
    this.socket.on('chatHistory', (history) => next(history));  // listen for chatHistory event
  }

  deleteChannel(channelName: string): void {                    // delete a channel
  this.socket.emit('deleteChannel', channelName);               // emit deleteChannel event
}

}
