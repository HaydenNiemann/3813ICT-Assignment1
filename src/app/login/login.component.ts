import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  
  users = [
    { username: 'super', password: 'super', role: 'SuperAdmin' },
    { username: 'admin', password: 'admin', role: 'GroupAdmin' },
    { username: 'user', password: 'user', role: 'User' }
  ];

  constructor(private router: Router) {}

  login() {
   
    const user = this.users.find(
      u => u.username === this.username && u.password === this.password
    );

    if (user) {
      
      sessionStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        role: user.role
      }));
      
      this.router.navigate(['/chat']);
    } else {
      
      this.errorMessage = 'Invalid credentials, please try again.';
    }
  }
}
