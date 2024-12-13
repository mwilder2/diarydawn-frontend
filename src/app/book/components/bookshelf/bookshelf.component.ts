import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, Subscription, combineLatest, finalize, map, of, shareReplay, startWith, take, takeUntil } from 'rxjs';
import { BookActions, BookSelectors, BookState } from '../..';
import { TruncatePipe } from '../../../../app/shared/pipes/truncate.pipe';
import { Book, SaveNewBookResult, UpdateBookDto } from '../../models/book.models';
import { PageActions, PageSelectors, PageService, PageState } from '../../../page';
import { Page } from '../../../page/models/page.models';
import { DialogService } from '../../../shared/services/dialog.service';
import { UserSelectors, UserState } from '../../../user';
import { BookCrudService } from '../../services/book-crud.service';
import { EditBookDialogComponent } from '../edit-book-dialog/edit-book-dialog.component';
import { TransferPagesDto } from '../../../page/models/page.models';
import { paths } from '../../../app-paths';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { BookChartComponent } from '../book-chart/book-chart.component';
import { TransferModalComponent } from '../transfer-modal/transfer-modal.component';
import { ConfirmDeleteBookDialogComponent } from '../confirm-delete-book/confirm-delete-book.component';
import { User } from '../../../user/models/user.models';
import { NavigationButtonComponent } from '../../../shared/components/navigation-button/navigation-button.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { GuidedTourModule } from 'ngx-guided-tour';
import { ExportGuidedToursService } from '../../../shared/services/guided-tour.service';
import { DisabledTooltipDirective } from '../../../shared/directives/disabled-tooltip.directive';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'bookshelf',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    BookChartComponent,
    EditBookDialogComponent,
    TransferModalComponent,
    ConfirmDeleteBookDialogComponent,
    NavigationButtonComponent,
    DragDropModule,
    TruncatePipe,
    GuidedTourModule,
    DisabledTooltipDirective,
    MatTooltip
  ],
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss'],
})
export class BookshelfComponent implements OnInit {
  books$: Observable<Book[]>;
  user$: Observable<User | null>;
  isLoading$: Observable<boolean> | undefined;
  pages: Page[] = [];
  newBook: Book = new Book(0, 0, '', '', 0, new Date(), new Date());
  selectedBook: Book | null = null;
  showNewBookForm = false;
  dialogConfig = new MatDialogConfig();
  private destroy$ = new Subject<void>();
  isAddingBook = false;
  paths = paths;
  backToProfileLabel = 'Go to Profile';
  _bookLength = 0;

  constructor(
    private bookStore: Store<BookState>,
    private pageStore: Store<PageState>,
    private userStore: Store<UserState>,
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService,
    private bookCrudService: BookCrudService,
    private pageService: PageService,
    private exportGuidedToursService: ExportGuidedToursService,


  ) {
    this.books$ = this.bookStore.select(BookSelectors.selectAllBooks);
    this.user$ = this.userStore.select(UserSelectors.selectUser);
  }

  ngOnInit(): void {

    combineLatest([
      this.books$,
      this.pageStore.select(PageSelectors.selectAllPages)
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([books, pages]) => {
        this.pages = pages;
        this._bookLength = books.length;
      });
  }

  public startTour(): void {
    this.exportGuidedToursService.startTour(this.exportGuidedToursService.bookshelfTour);
  }



  onSaveNewBook(): void {
    this.isAddingBook = true;
    this.books$.pipe(
      take(1),
      map(books => books.reduce((max, book) => Math.max(max, book.order), 0) + 1) // Calculate the next order value
    ).subscribe(nextOrder => {
      this.dialogService.openSaveNewBookDialog().pipe(
        takeUntil(this.destroy$), // Ensures subscription is unsubscribed when component is destroyed.
        finalize(() => this.isAddingBook = false) // Ensures isAddingBook is set to false when the observable completes or errors out.
      ).subscribe({
        next: (result: SaveNewBookResult) => {
          if (result) {
            this.bookCrudService.addBook({ ...result, order: nextOrder }); // Include the calculated order
          }
        },
        error: (error) => {
          console.error('Error saving new book:', error);
        }
      });
    });
  }


  deleteBook(book: Book): void {
    // check if there are any pages in the book
    const pages = this.hasPages(book);
    if (pages) {
      this.dialogService
        .openConfirmDeleteBookDialog(book)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: number) => {
          if (result) {
            // Call the deleteBook method from the BookCrudService
            this.bookCrudService.deleteBook(book.id!);
          }
        });
    } else {
      this.dialogService.openDeleteBookDialog(book)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {
            // Call the deleteBook method from the BookCrudService
            this.bookCrudService.deleteBook(book.id!);
          }
        });
    }
  }

  editBook(book: Book): void {
    const dialogRef = this.dialog.open(EditBookDialogComponent, {
      data: { book: { ...book }, isNewBook: false },
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: UpdateBookDto | null) => {
        if (result) {
          this.bookCrudService.updateBook(book.id!, result);
        }
      });
  }

  openBookInfoPopup(book: Book): void {
    this.pageStore.dispatch(
      PageActions.setCurrentBookId({ bookId: book.id! })
    );
    this.dialogService.openBookInfoPopup(book);
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
          const transferingPageIds = result.transferringPageIds; // This line was corrected from 'transferingPageIds' to 'transferredPageIds'
          const deleteSourceBook = result.deleteSourceBook;

          // Call the transferPages method from the PageCrudService with correct parameters
          this.pageService.transferPages(sourceBookId, targetBookId, transferingPageIds, deleteSourceBook);
        }
      });
  }


  onDrop(event: CdkDragDrop<Book[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      this.books$.pipe(take(1)).subscribe(books => {
        const updatedBooks = [...books];
        moveItemInArray(updatedBooks, event.previousIndex, event.currentIndex);
        const reorderDtos = updatedBooks.map((book, index) => ({ bookId: book.id!, order: index }));
        this.bookStore.dispatch(BookActions.reorderBooks({ reorderDtos }));
      });
    }
  }

  hasPages(book: Book): boolean {
    // Check if there are pages in the specified book
    const hasPagesInBook = this.pages.some(page => page.bookId === book.id);
    // Check if there is more than one book
    const multipleBooksExist = this._bookLength > 1;

    return hasPagesInBook && multipleBooksExist;
  }


  toProfile(): void {
    this.router.navigate([this.paths.profile]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
