import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../models/book.models';

@Pipe({
  name: 'bookSortByDate',
  standalone: true,
})
export class BookSortByDatePipe implements PipeTransform {
  transform(books: Book[]): Book[] {
    return books.slice().sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return a.updatedAt > b.updatedAt ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
