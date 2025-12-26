import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-decrypt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './decrypt.component.html',
  styles: []
})
export class DecryptComponent {
  encryptedText = '';
  passphrase = '';
  decrypted = '';
  error = '';

  decrypt() {
    this.decrypted = '';
    this.error = '';

    if (!this.encryptedText.trim() || !this.passphrase.trim()) {
      this.error = '❗ Please enter both the encrypted text and passphrase.';
      return;
    }

    try {
      const decoded = decodeURIComponent(escape(atob(this.encryptedText)));
      this.decrypted = this.simpleEncrypt(decoded, this.passphrase);

      if (!this.decrypted.trim()) {
        this.error = 'The decrypted message is empty. Maybe the passphrase is incorrect?';
        this.decrypted = '';
      }
    } catch (err) {
      this.error = 'Failed to decrypt. Check the encrypted text and passphrase.';
    }
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
