import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { take } from 'rxjs';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  path: string | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe({
      next: (data) => {
        this.path = data['path'] || 'No suggestion available';
      },
      error: () => {
        this.path = 'No suggestion available';
      }
    });
  }
}