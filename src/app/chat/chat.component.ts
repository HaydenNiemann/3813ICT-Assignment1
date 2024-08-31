import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  userRole: string | null = '';
  username: string | null = '';

  constructor(private socketService: SocketService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.userRole = currentUser.role;
    this.username = currentUser.username;

    if (!this.userRole) {
      this.router.navigate(['/login']);
    }

    this.socketService.getMessage((message: string) => {
      this.messages.unshift(message);
    });
  }

  sendMessage(): void {
    if (this.messagecontent.trim()) {
      this.socketService.sendMessage(this.messagecontent);
      this.messagecontent = ''; // clear message input after sending
    }
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']); // Redirect to login page
  }
}
