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
  username: string = '';                          // username for login
  password: string = '';                          // password for login   
  newUsername: string = '';                       // username for registration  
  newPassword: string = '';                       // password for registration  
  loginErrorMessage: string = '';                 // error message for login
  registrationErrorMessage: string = '';          // error message for registration
  successMessage: string = '';                    // success message for registration   
  showRegistration: boolean = false;              // flag to show/hide registration form 

  users = [                                  // list of users hardcoded for demo
    { username: 'super', password: '123', role: 'SuperAdmin' }, 
    { username: 'admin', password: 'admin', role: 'GroupAdmin' },
    { username: 'user', password: 'user', role: 'User' }
  ];

  constructor(private router: Router) {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');    // get users from local storage
    if (storedUsers.length > 0) {                                             // if users exist, use them    
      this.users = storedUsers;                                               // else use hardcoded users          
    }
  }

  login() {                                                                   // login function

    if (!this.username.trim() || !this.password.trim()) {                     // check if username and password are entered     
      this.loginErrorMessage = 'Please enter both username and password.';    // if not, show error message
      return;
    }

    const user = this.users.find(                                           // find user in the list of users     
      u => u.username === this.username && u.password === this.password     // based on username and password
    );

    if (user) {                                                            // if user is found, navigate to chat page   
      sessionStorage.setItem('currentUser', JSON.stringify({               // store user in session storage
        username: user.username,                                           // for use in chat component
        role: user.role                                                    // to show username and role              
      }));
      this.router.navigate(['/chat']);                                     // navigate to chat page   
    } else {
      this.loginErrorMessage = 'Invalid credentials, please try again.';   // if user is not found, show error message
      this.registrationErrorMessage = '';                                  // clear registration error message 
    }
  }

  register() {                                                            // registration function      
    const existingUser = this.users.find(u => u.username === this.newUsername); // check if username already exists

    if (existingUser) {                                                   // if username exists, show error message  
      this.loginErrorMessage = '';                                        // clear login error message
      this.registrationErrorMessage = 'Username already taken. Please choose a different one.'; //setting error message
    } else {
      const newUser = { username: this.newUsername, password: this.newPassword, role: 'User' }; // create new user
      this.users.push(newUser);                                           // add new user to the list of users        
      localStorage.setItem('users', JSON.stringify(this.users));          // store updated list of users in local storage
      this.successMessage = 'Registration successful! You can now log in.'; // show success message
      this.registrationErrorMessage = '';                                 // clear registration error message        
      this.loginErrorMessage = '';                                        // clear login error message
      
      
      this.newUsername = '';                                              // clear new username and password fields        
      this.newPassword = '';                                              // after successful registration
      this.showRegistration = false;                                      // hide registration form after successful registration
    }
  }

  toggleRegistration() {                                                // function to toggle between login and registration forms    
    this.showRegistration = !this.showRegistration;                     // show registration form if it is hidden and vice versa    
    this.successMessage = '';                                           // clear success message     
    this.loginErrorMessage = '';                                        // clear login error message  
    this.registrationErrorMessage = '';                                 // clear registration error message 
  }
}
