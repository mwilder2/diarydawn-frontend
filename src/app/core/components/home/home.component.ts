import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../shared/services/dialog.service';
import { paths } from '../../../app-paths';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomePageComponent {
  paths = paths;
  constructor(
    private dialogService: DialogService,
    private router: Router
  ) {
  }

  openHeroDialog() {
    this.dialogService.openHeroDialog({ context: 'home' }).subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate([this.paths.oneOfYouPublic]);
      }
    });
  }
}
