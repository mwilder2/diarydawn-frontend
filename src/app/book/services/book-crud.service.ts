import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BookActions, BookState } from '..';
import { SaveNewBookResult, UpdateBookDto } from '../models/book.models';

@Injectable({
  providedIn: 'root',
})
export class BookCrudService {
  constructor(private bookStore: Store<BookState>) {
  }

  addBook(result: SaveNewBookResult): void {
    this.bookStore.dispatch(BookActions.addBook({ book: result }));
  }

  deleteBook(bookId: number): void {
    this.bookStore.dispatch(BookActions.deleteBook({ bookId }));
  }

  updateBook(bookId: number, book: UpdateBookDto): void {
    this.bookStore.dispatch(BookActions.updateBook({ bookId, book }));
  }
}
