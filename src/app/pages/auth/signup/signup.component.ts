import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';

import {
  Firestore,
  doc,
  setDoc,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async signup() {
    this.error = '';
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill all fields';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    try {
      this.loading = true;
      const cred = await this.authService.signup(this.email, this.password);
      if (cred.user?.uid) {
        await setDoc(doc(this.firestore, 'users', cred.user.uid), {
          uid: cred.user.uid,
          name: this.name,
          email: this.email,
          createdAt: new Date(),
        });
      }
      alert('Account created successfully!');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error = err.message || 'Failed to create account.';
    } finally {
      this.loading = false;
    }
  }
}
