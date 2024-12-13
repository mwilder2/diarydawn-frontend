import { Component } from '@angular/core';
import { paths } from '../../../app-paths';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './terms-of-service.component.html',
  styleUrl: './terms-of-service.component.scss'
})
export class TermsOfServiceComponent {
  paths = paths;
}
