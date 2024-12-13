// The transfer pages action

// The transfer pages action is responsible for transferring the pages from one book to another. It also handles the post-transfer actions.
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { Page } from '../../../page/models/page.models';
import { BookSelectors, BookState } from '../..';
import { Book } from '../../models/book.models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageSelectors } from '../../../page';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transfer-modal',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss'],
})
export class TransferModalComponent implements OnInit {
  form: FormGroup;
  pages$: Observable<Page[]>;
  books$: Observable<Book[]>;

  constructor(
    private fb: FormBuilder,
    private bookStore: Store<BookState>,
    public dialogRef: MatDialogRef<TransferModalComponent>,
    private snackBarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {
    this.books$ = this.bookStore.select(BookSelectors.selectAllBooks).pipe(
      map(books => books.filter(book => book.id !== data.book.id))
    );

    this.pages$ = this.bookStore.select(PageSelectors.selectFilterPagesByBookId(this.data.book.id!));

    this.form = this.fb.group({
      targetBookId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // Ensures the input is numeric
      transferOption: ['all_pages', Validators.required],
      selectedPages: [[], Validators.required],
      deleteSourceBook: [false]
    });

    this.form.get('transferOption')!.valueChanges.subscribe(option => {
      const selectedPagesControl = this.form.get('selectedPages')!;
      if (option === 'all_pages') {
        selectedPagesControl.clearValidators();
        selectedPagesControl.reset(); // Optionally reset the value to clear selection
      } else {
        selectedPagesControl.setValidators(Validators.required);
      }
      selectedPagesControl.updateValueAndValidity();
    });
  }

  ngOnInit(): void { }

  transferPages(): void {
    if (this.form.valid) {
      const { targetBookId, selectedPages, deleteSourceBook, transferOption } = this.form.value;

      // If "Transfer all pages" is selected, get all page IDs
      if (transferOption === 'all_pages') {
        this.pages$.pipe(take(1)).subscribe(pages => {
          this.submitTransfer(targetBookId, pages.map(p => p.id), deleteSourceBook);
        });
      } else {
        // Proceed with selected pages
        this.submitTransfer(targetBookId, selectedPages.map((page: { id: number }) => page.id), deleteSourceBook);
      }
    } else {
      this.snackBarService.openSnackBar('Please fill in all required fields.', 'Close');
    }
  }

  submitTransfer(targetBookId: string, pageIds: number[], deleteSourceBook: boolean) {
    if (pageIds.length === 0 || !targetBookId) {
      this.snackBarService.openSnackBar('Please select pages and/or a target book to transfer.', 'Close');
    } else if (targetBookId === String(this.data.book.id)) {
      this.snackBarService.openSnackBar('Cannot transfer pages to the same book.', 'Close');
    } else {
      this.dialogRef.close({
        sourceBookId: this.data.book.id,
        targetBookId,
        transferringPageIds: pageIds,
        deleteSourceBook
      });
    }
  }

  isTransferSelectedPages(): boolean {
    return this.form.get('transferOption')!.value === 'selected_pages';
  }

  // TODO: Fix this, not currently working
  getColorByPageType(pageType: string): string {
    const colors: { [key: string]: string } = {
      Limitless: '#084c61',
      Gratitude: '#a83632',
      Affirmation: '#36817a',
      Emotion: '#7a3a8a',
      Lesson: '#097c71',
      Dream: '#135e8c',
      Journey: '#572985',
    };

    return colors[pageType] || '#000000'; // Default color (black) if diaryType is not found
  }
}
