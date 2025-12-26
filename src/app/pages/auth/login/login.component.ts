import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .then(() => {
          alert('Logged in successfully!');
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          this.error = err.message;
        });
    } else {
      this.error = 'Please enter both email and password';
    }
  }
}
