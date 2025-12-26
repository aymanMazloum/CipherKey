import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA9iut2FIaJ0-qO5StmUR8czxs-YGj-Ylc",
  authDomain: "cipherkey-88802.firebaseapp.com",
  projectId: "cipherkey-88802",
  storageBucket: "cipherkey-88802.appspot.com",
  messagingSenderId: "196839392089",
  appId: "1:196839392089:web:bc24d7045dc4db79310248"
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
