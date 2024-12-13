import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../shared/services/dialog.service';
import { Book } from '../../models/book.models';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { TransferPagesDto } from '../../../page/models/page.models';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from '../../../page/services/page.service';
import { PageActions, PageState } from '../../../page';
import { Store } from '@ngrx/store';

@Component({
  selector: 'confirm-delete-book',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
  ],
  templateUrl: './confirm-delete-book.component.html',
  styleUrls: ['./confirm-delete-book.component.scss'],
})
export class ConfirmDeleteBookDialogComponent {
  confirmed = false;
  book: Book;
  private destroy$ = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteBookDialogComponent>,
    private dialogService: DialogService,
    private pageService: PageService,
    private pageStore: Store<PageState>,
    @Inject(MAT_DIALOG_DATA) public data: { book: Book }
  ) {
    this.book = data.book;
  }


  openTransferModal(book: Book): void {
    this.pageStore.dispatch(
      PageActions.setCurrentBookId({ bookId: book.id! })
    );

    this.dialogService
      .openTransferModal(book)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: TransferPagesDto) => {
        if (result) {
          // Correct the property name to match what's expected based on the DTO and the modal's close data
          const sourceBookId = result.sourceBookId;
          const targetBookId = result.targetBookId;
          const transferringPageIds = result.transferringPageIds; // Ensure this line matches your actual DTO structure
          const deleteSourceBook = result.deleteSourceBook;

          // Call the transferPages method from the PageCrudService with correct parameters
          this.pageService.transferPages(sourceBookId, targetBookId, transferringPageIds, deleteSourceBook);

          this.dialogService.closeAllDialogs();
        }
      });
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
