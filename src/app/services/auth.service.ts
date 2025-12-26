import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from '@angular/fire/auth';
import { UserCredential } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      this.userSubject.next(user);
      console.log('Auth state changed:', user);
    });
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password).then((cred) => {
      this.currentUser = cred.user;
      this.userSubject.next(cred.user);
      return cred;
    });
  }

  signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password).then((cred) => {
      this.currentUser = cred.user;
      this.userSubject.next(cred.user);
      return cred;
    });
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.currentUser = null;
      this.userSubject.next(null);
    });
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
