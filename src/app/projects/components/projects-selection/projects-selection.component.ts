import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'projects-selection',
  standalone: true,
  imports: [],
  templateUrl: './projects-selection.component.html',
  styleUrl: './projects-selection.component.scss'
})
export class ProjectsSelectionComponent {
  constructor(private router: Router) { }

  navigateTo(project: string) {
    this.router.navigate([`/${project}`]);
  }
}
