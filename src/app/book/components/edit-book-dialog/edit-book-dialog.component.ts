import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../models/book.models';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { DiaryTypeCountPipe } from '../../../page/pipes/entry-type-count.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'edit-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    DiaryTypeCountPipe,
  ],
  templateUrl: './edit-book-dialog.component.html',
  styleUrls: ['./edit-book-dialog.component.scss'],
})
export class EditBookDialogComponent {
  editBookForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditBookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.editBookForm = new FormGroup({
      title: new FormControl(this.data.book.title, Validators.required),
      description: new FormControl(this.data.book.description, Validators.required),
    });
  }

  onSubmit(): void {
    if (this.editBookForm.valid) {
      const updatedBook = {
        ...this.data.book,
        ...this.editBookForm.value,
      };
      this.dialogRef.close(updatedBook); // Close the dialog and pass the updated book
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without passing data
  }
}
