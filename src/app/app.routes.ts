import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EncryptComponent } from './pages/encrypt/encrypt.component';
import { DecryptComponent } from './pages/decrypt/decrypt.component';
import { MessageListComponent } from './pages/message-list/message-list.component';

export const routes: Routes = [
    {path:'',component:WelcomeComponent, children:[
        {path:'login',component:LoginComponent},
        {path:'signup',component:SignupComponent},
        {path: '',redirectTo: 'login',pathMatch: 'full'}
    ]
    
    },
    {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path:'dashboard',component:DashboardComponent,
    children: [
    { path: 'encrypt', component: EncryptComponent },
    { path: 'decrypt', component: DecryptComponent },
    { path: 'messages', component: MessageListComponent },
    { path: '', redirectTo: 'encrypt', pathMatch: 'full' }
  ]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
