import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { BookService } from '../services/book.service';
import { BookState } from './book.reducer';
import { Store } from '@ngrx/store';
import { BookActions } from '..';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { TokenService } from '../../auth/services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class BookEffects {
  getBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.getBooks),
      switchMap(() =>
        this.bookService.getBooks().pipe(
          map((books) => BookActions.getBooksSuccess({ books: books })),
          catchError((error) => of(BookActions.getBooksFailure({ error })))
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.addBook),
      switchMap(({ book }) =>
        this.bookService.addBook(book).pipe(
          tap(({ message }) => {
            this.snackbarService.openSnackBar(message, 'Close');
          }),
          map(({ id }) =>
            BookActions.addBookSuccess({ book: { ...book, id } })
          ),
          catchError((error) => {
            this.snackbarService.openSnackBar('Error adding book', 'Close');
            return of(BookActions.addBookFailure({ error }));
          })
        )
      )
    )
  );

  updateBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.updateBook),
      switchMap(({ bookId, book }) =>
        this.bookService.updateBook(bookId, book).pipe(
          tap(({ message }) => {
            this.snackbarService.openSnackBar(message, 'Close');
          }),
          map(() => BookActions.updateBookSuccess({ book })),
          catchError((error) => {
            this.snackbarService.openSnackBar('Error updating book', 'Close');
            return of(BookActions.updateBookFailure({ error }));
          })
        )
      )
    )
  );

  deleteBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.deleteBook),
      switchMap(({ bookId }) =>
        this.bookService.deleteBook(bookId).pipe(
          tap(({ message }) => {
            this.snackbarService.openSnackBar(message, 'close');
          }),
          map(() => BookActions.deleteBookSuccess({ bookId })),
          catchError((error) => {
            this.snackbarService.openSnackBar('Error deleting book', 'close');
            return of(BookActions.deleteBookFailure({ error }));
          })
        )
      )
    )
  );


  reorderBooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookActions.reorderBooks),
      mergeMap(action =>
        this.bookService.reorderBooks(action.reorderDtos).pipe(
          map(response => BookActions.reorderBooksSuccess({ books: response.books })),
          catchError(error => of(BookActions.reorderBooksFailure({ error })))
        )
      )
    )
  );
  httpClient: any;

  constructor(
    private actions$: Actions,
    private bookService: BookService,
    private bookStore: Store<BookState>,
    private router: Router,
    private snackbarService: SnackBarService,
    private tokenService: TokenService
  ) {
  }
}
