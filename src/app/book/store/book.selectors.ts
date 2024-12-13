import { createFeatureSelector, createSelector } from '@ngrx/store';
import { bookFeatureKey, BookState, adapter } from './book.reducer';
import { Book } from '../models/book.models';
import { Dictionary } from '@ngrx/entity';

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectBookState = createFeatureSelector<BookState>(bookFeatureKey);

export const selectAllBooks = createSelector(selectBookState, selectAll);

export const selectBookEntities = createSelector(
  selectBookState,
  selectEntities
);

export const selectBookById = (id: number) =>
  createSelector(
    selectBookEntities,
    (entities: Dictionary<Book>) => entities[id]
  );

export const selectAllBooksExceptCurrent = (id: number) =>
  createSelector(selectAllBooks, (books: Book[]) =>
    books.filter((book) => book.id !== id)
  );

export const selectIsBooksLoaded = createSelector(
  selectBookState,
  (state: BookState) => state.isBooksLoaded
);

export const selectIsLoading = createSelector(
  selectBookState,
  (state: BookState) => state.isLoading
);

export const selectError = createSelector(
  selectBookState,
  (state: BookState) => state.error
);

export const selectNumberOfBooks = createSelector(
  selectAllBooks,
  (books: Book[]) => books.length
);

