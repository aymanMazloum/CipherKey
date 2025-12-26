import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-nav2',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav2.component.html'
})
export class Nav2Component {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
