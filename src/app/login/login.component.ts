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
  newUsername: string = '';
  newPassword: string = '';
  loginErrorMessage: string = '';
  registrationErrorMessage: string = '';
  successMessage: string = '';
  showRegistration: boolean = false;  

  users = [
    { username: 'super', password: 'super', role: 'SuperAdmin' },
    { username: 'admin', password: 'admin', role: 'GroupAdmin' },
    { username: 'user', password: 'user', role: 'User' }
  ];

  constructor(private router: Router) {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.length > 0) {
      this.users = storedUsers;
    }
  }

  login() {
    
    if (!this.username.trim() || !this.password.trim()) {
      this.loginErrorMessage = 'Please enter both username and password.';
      return;
    }

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
      this.loginErrorMessage = 'Invalid credentials, please try again.';
      this.registrationErrorMessage = ''; 
    }
  }

  register() {
    const existingUser = this.users.find(u => u.username === this.newUsername);

    if (existingUser) {
      this.registrationErrorMessage = 'Username already taken. Please choose a different one.';
      this.loginErrorMessage = ''; 
    } else {
      const newUser = { username: this.newUsername, password: this.newPassword, role: 'User' };
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      this.successMessage = 'Registration successful! You can now log in.';
      this.registrationErrorMessage = '';
      this.loginErrorMessage = '';
      
      
      this.newUsername = '';
      this.newPassword = '';
      this.showRegistration = false;
    }
  }

  toggleRegistration() {
    this.showRegistration = !this.showRegistration;
    this.successMessage = '';
    this.loginErrorMessage = '';
    this.registrationErrorMessage = '';
  }
}
