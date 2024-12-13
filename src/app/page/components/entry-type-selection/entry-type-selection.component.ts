import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-entry-type-selection',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  templateUrl: './entry-type-selection.component.html',
  styleUrls: ['./entry-type-selection.component.scss'],
})
export class EntryTypeSelectionComponent {
  diaryTypes = [
    'Limitless',
    'Gratitude',
    'Emotion',
    'Dream',
    'Lesson',
    'Affirmation',
    'Journey',
  ];

  constructor(public dialogRef: MatDialogRef<EntryTypeSelectionComponent>) {
  }

  onDiaryTypeSelected(selectedDiaryType: string): void {
    this.dialogRef.close(selectedDiaryType);
  }

  getIconForDiaryType(diaryType: string): string {
    switch (diaryType) {
      case 'Limitless':
        return 'create';
      case 'Gratitude':
        return 'favorite';
      case 'Affirmation':
        return 'check_circle';
      case 'Emotion':
        return 'mood';
      case 'Lesson':
        return 'school';
      case 'Dream':
        return 'bedtime';
      case 'Journey':
        return 'map';
      default:
        return '';
    }
  }

  getDescriptionForDiaryType(diaryType: string): string {
    switch (diaryType) {
      case 'Limitless':
        return 'Write about anything and everything.';
      case 'Gratitude':
        return 'Express your gratitude and appreciation.';
      case 'Affirmation':
        return 'Write your personal affirmations.';
      case 'Emotion':
        return 'Explore and understand your emotions.';
      case 'Lesson':
        return 'Reflect on the lessons you have learned.';
      case 'Dream':
        return 'Record and analyze your dreams.';
      case 'Journey':
        return 'Document your personal journeys and adventures.';
      default:
        return '';
    }
  }
}
