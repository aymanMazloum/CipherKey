import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Nav1Component } from '../../shared/nav1/nav1.component';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [CommonModule, RouterModule,Nav1Component],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {}
