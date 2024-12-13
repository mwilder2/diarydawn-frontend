import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Book } from '../models/book.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  bookUrl = environment.bookUrl;

  constructor(private http: HttpClient) {
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.bookUrl}getbooks`);
  }

  addBook(book: Book): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(
      `${this.bookUrl}addbook`,
      book
    );
  }

  updateBook(
    bookId: number,
    book: Book
  ): Observable<{ id: number; message: string }> {
    return this.http.put<{ id: number; message: string }>(`${this.bookUrl}update/${bookId}`, book);
  }

  deleteBook(bookId: number): Observable<{ id: number, message: string }> {
    return this.http.delete<{ id: number, message: string }>(
      `${this.bookUrl}delete/${bookId}`
    );
  }

  reorderBooks(reorderDtos: { bookId: number; order: number }[]): Observable<{ books: Book[], message: string }> {
    return this.http.post<{ books: Book[], message: string }>(`${this.bookUrl}reorderbooks`, reorderDtos)
      .pipe(
        catchError(error => {
          console.error('Error reordering books', error);
          return throwError(() => error);
        })
      );
  }
}
