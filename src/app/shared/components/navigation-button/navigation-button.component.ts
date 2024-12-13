import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-button',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './navigation-button.component.html',
  styleUrls: ['./navigation-button.component.scss']
})
export class NavigationButtonComponent {
  @Input() routePath: string = '';
  @Input() label: string = 'Back';

  constructor(private router: Router) { }

  navigate() {
    this.router.navigate([this.routePath], { queryParams: { index: null }, queryParamsHandling: 'merge' });
  }

  ngOnInit() {
  }
}