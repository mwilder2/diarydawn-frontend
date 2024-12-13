import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../../auth/services/token.service';
import { PublicGateWayService } from '../../services/public.gateway.service';
import { SnackBarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-hero-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  templateUrl: './hero-dialog.component.html',
  styleUrls: ['./hero-dialog.component.scss'],
})
export class HeroDialogComponent {
  context: 'home' | 'bookInfo' | 'pageComponent';
  bookId?: number;
  confirmed = false;
  email: string = '';
  isPublic = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HeroDialogComponent>,
    private snackBarService: SnackBarService,
  ) {
    this.context = data.context;
    this.bookId = data.bookId || null;  // Assign null if bookId is not provided
  }

  get dialogMessage(): string {
    switch (this.context) {
      case 'home':
        this.isPublic = true;
        return "Welcome to a transformative journey at Diary Dawn. This feature uses advanced psychological tools to analyze submitted text and reveal your unique superpowers. Begin by entering your text on the next page. This trial does not require registration.";
      case 'bookInfo':
      case 'pageComponent':
        return "Prepare to unlock the secrets of your personality at Diary Dawn. Our 'Discover Your Superpowers' feature uses advanced psychological classifiers to analyze your diary entries and illuminate your unique superpowers.";
      default:
        return "Uncover your superpowers by analyzing your diary entries.";
    }
  }

  confirmAction(): void {

    if (this.confirmed) {
      try {
        this.dialogRef.close({ confirmed: this.confirmed, bookId: this.bookId });
      } catch (error) {
        // Handle errors during connection or provide feedback
        this.snackBarService.openSnackBarWithClass(
          "Unable to connect. Please try again later.",
          "Close",
          "snackbar-error"
        );
        this.dialogRef.close();
      }
    } else {
      this.snackBarService.openSnackBarWithClass(
        "Please confirm to proceed.",
        "Close",
        "snackbar-error"
      );
      this.dialogRef.close();
    }
  }
}