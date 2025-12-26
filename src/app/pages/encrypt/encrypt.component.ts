import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-encrypt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './encrypt.component.html',
  styles: []
})
export class EncryptComponent implements OnInit, OnDestroy {
  message = '';
  passphrase = '';
  encrypted = '';
  copied = false;
  currentUser: User | null = null;
  private userSub?: Subscription;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated:', user?.email || 'No user');
    });
  }

  encrypt() {
    if (!this.message.trim() || !this.passphrase.trim()) {
      alert('Please enter both a message and a passphrase.');
      return;
    }

    if (!this.currentUser) {
      alert('You must be logged in to encrypt messages.');
      return;
    }

    const encoded = this.simpleEncrypt(this.message, this.passphrase);
    this.encrypted = btoa(unescape(encodeURIComponent(encoded)));

    const data = {
      userId: this.currentUser.uid,
      originalText: this.message,
      encryptedText: this.encrypted,
      timestamp: new Date()
    };

    addDoc(collection(this.firestore, 'messages'), data)
      .then(() => {
      alert("message added successfully!")
      })
      .catch(err => {
        console.error('Error saving message:', err);
        alert('Failed to save message. Please try again.');
      });
  }

  copyEncrypted() {
    if (!this.encrypted) return;
    navigator.clipboard.writeText(this.encrypted).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 1500);
    });
  }

  simpleEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  resetFields() {
    this.message = '';
    this.passphrase = '';
    this.encrypted = '';
    this.copied = false;
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }
}
