import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000'); 
  }

  joinChannel(channelName: string, name: string): void {
    this.socket.emit('joinChannel', channelName);
  }

  sendMessage(channelName: string, message: string, user: string | null): void {
    this.socket.emit('sendMessage', { channelName, message, user });
  }

  getMessages(next: (message: any) => void): void {
    this.socket.off('newMessage'); 
    this.socket.on('newMessage', (message) => next(message)); 
  }

  getChatHistory(next: (history: any[]) => void): void {
    this.socket.off('chatHistory'); 
    this.socket.on('chatHistory', (history) => next(history)); 
  }

  deleteChannel(channelName: string): void {
  this.socket.emit('deleteChannel', channelName);
}

}
