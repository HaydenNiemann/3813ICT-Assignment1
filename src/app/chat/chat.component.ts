import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocketService } from '../services/socket.service';

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

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.getMessage((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage(): void {
    if (this.messagecontent.trim()) {
      this.socketService.sendMessage(this.messagecontent);
      this.messagecontent = ''; // clear message input after sending
    }
  }
}
