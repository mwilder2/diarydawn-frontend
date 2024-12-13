import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { BookActions } from '..';
import { Book } from '../models/book.models';

export const bookFeatureKey = 'book';

export interface BookState extends EntityState<Book> {
  isBooksLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Book> = createEntityAdapter<Book>();

export const initialBookState: BookState = adapter.getInitialState({
  isBooksLoaded: false,
  isLoading: false,
  error: null,
});

// book.reducer.ts
export const reducer = createReducer(
  initialBookState,
  on(BookActions.getBooks, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(BookActions.getBooksSuccess, (state, { books }) => {
    return adapter.setAll(books, {
      ...state,
      isBooksLoaded: true,
      isLoading: false,
    });
  }),
  on(BookActions.getBooksFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(BookActions.addBook, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(BookActions.addBookSuccess, (state, { book }) => {
    return adapter.addOne(book, {
      ...state,
      isLoading: false,
    });
  }),
  on(BookActions.addBookFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(BookActions.updateBook, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(BookActions.updateBookSuccess, (state, { book }) => {
    return adapter.updateOne(
      { id: book.id!, changes: book },
      {
        ...state,
        isLoading: false,
      }
    );
  }),
  on(BookActions.updateBookFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(BookActions.deleteBook, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(BookActions.deleteBookSuccess, (state, { bookId }) => {
    return adapter.removeOne(bookId, {
      ...state,
      isLoading: false,
    });
  }),
  on(BookActions.deleteBookFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(BookActions.resetBookState, (state) => ({
    ...state,
    ...initialBookState,
  })),
  on(BookActions.setErrorMessage, (state, { errorMessage }) => ({
    ...state,
    errorMessage: errorMessage,
  })),
  on(BookActions.clearErrorMessage, (state) => ({
    ...state,
    errorMessage: null,
  })),
  on(BookActions.reorderBooks, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BookActions.reorderBooksSuccess, (state, { books }) => {
    return adapter.setAll(books, {
      ...state,
      isLoading: false,
      error: null
    });
  }),
  on(BookActions.reorderBooksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);


export function bookReducer(state: BookState | undefined, action: Action) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: BookState | undefined, action: Action) {
  console.log('Book state', state);
  console.log('Book action', action);

  return reducer(state, action);
}