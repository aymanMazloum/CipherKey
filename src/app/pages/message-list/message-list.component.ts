import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './message-list.component.html',
  styles: []
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  currentUser: User | null = null;
  unsubscribeFn: (() => void) | null = null;

  showDecrypt = false;
  decryptPassphrase = '';
  selectedMessage: any = null;
  decryptedMessage = '';
  decryptError = '';

  showEdit = false;
  editOriginalText = '';
  editPassphrase = '';
  editError = '';
  editMsgId = '';

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      this.loadMessages();
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeFn) this.unsubscribeFn();
  }

  loadMessages() {
    this.messages = [];
    if (!this.currentUser) return;
    const colRef = collection(this.firestore, 'messages');
    const q = query(colRef, where('userId', '==', this.currentUser.uid));
    this.unsubscribeFn = onSnapshot(q, (snapshot) => {
      this.messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    });
  }

  deleteMessage(msg: any) {
    if (!confirm('Are you sure you want to delete this message?')) return;
    deleteDoc(doc(this.firestore, 'messages', msg['id']))
      .catch(err => {
        alert('Failed to delete!');
        console.error(err);
      });
  }

  openDecrypt(msg: any) {
    this.selectedMessage = msg;
    this.showDecrypt = true;
    this.decryptedMessage = '';
    this.decryptError = '';
    this.decryptPassphrase = '';
    this.showEdit = false;
  }
  performDecrypt() {
    if (!this.selectedMessage || !this.decryptPassphrase.trim()) {
      this.decryptError = 'Enter passphrase.';
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(this.selectedMessage['encryptedText'])));
      const decrypted = this.simpleEncrypt(decoded, this.decryptPassphrase);
      if (!decrypted.trim()) {
        this.decryptError = 'Incorrect passphrase or message!';
        this.decryptedMessage = '';
        return;
      }
      this.decryptedMessage = decrypted;
      this.decryptError = '';
    } catch (e) {
      this.decryptedMessage = '';
      this.decryptError = 'Failed to decrypt! Maybe wrong text/passphrase.';
    }
  }

  openEdit(msg: any) {
    this.showEdit = true;
    this.editOriginalText = msg['originalText'] || '';
    this.editPassphrase = '';
    this.editError = '';
    this.editMsgId = msg['id'];
    this.showDecrypt = false;
  }
  performEdit() {
    if (!this.editOriginalText.trim() || !this.editPassphrase.trim()) {
      this.editError = 'Enter both message and passphrase.';
      return;
    }
    const encoded = this.simpleEncrypt(this.editOriginalText, this.editPassphrase);
    const encryptedText = btoa(unescape(encodeURIComponent(encoded)));

    updateDoc(doc(this.firestore, 'messages', this.editMsgId), {
      originalText: this.editOriginalText,
      encryptedText,
      timestamp: new Date()
    }).then(() => {
      this.closeDialogs();
    }).catch(err => {
      this.editError = 'Failed to update!';
      console.error(err);
    });
  }

  closeDialogs() {
    this.showDecrypt = false;
    this.selectedMessage = null;
    this.decryptedMessage = '';
    this.decryptError = '';
    this.decryptPassphrase = '';

    this.showEdit = false;
    this.editOriginalText = '';
    this.editPassphrase = '';
    this.editError = '';
    this.editMsgId = '';
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
}
