import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { DiaryDawnOverviewTabComponent } from '../diary-dawn-overview/diary-dawn-overview.component';
import { DiaryDawnFeaturesTabComponent } from '../diary-dawn-features/diary-dawn-features.component';
import { DiaryDawnTechnologiesTabComponent } from '../diary-dawn-technologies/diary-dawn-technologies.component';
import { DiaryDawnTestimonialsTabComponent } from '../diary-dawn-testimonials/diary-dawn-testimonials.component';

@Component({
  selector: 'project-diary-dawn',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    DiaryDawnOverviewTabComponent,
    DiaryDawnFeaturesTabComponent,
    DiaryDawnTechnologiesTabComponent,
    DiaryDawnTestimonialsTabComponent,
  ],
  templateUrl: './project-diary-dawn.component.html',
  styleUrl: './project-diary-dawn.component.scss'
})
export class ProjectDiaryDawnComponent {

}
