import { createAction, props } from '@ngrx/store';
import { Book } from '../models/book.models';

export const getBooks = createAction('[Book] Get Books');

export const getBooksSuccess = createAction(
  '[Book] Get Books Success',
  props<{ books: Book[] }>()
);

export const getBooksFailure = createAction(
  '[Book] Get Books Failure',
  props<{ error: any }>()
);

export const addBook = createAction('[Book] Add Book', props<{ book: Book }>());

export const addBookSuccess = createAction(
  '[Book] Add Book Success',
  props<{ book: Book }>()
);
export const addBookFailure = createAction(
  '[Book] Add Book Failure',
  props<{ error: any }>()
);

export const updateBook = createAction(
  '[Book] Update Book',
  props<{ bookId: number; book: Book }>()
);
export const updateBookSuccess = createAction(
  '[Book] Update Book Success',
  props<{ book: Book }>()
);
export const updateBookFailure = createAction(
  '[Book] Update Book Failure',
  props<{ error: any }>()
);

export const deleteBook = createAction(
  '[Book] Delete Book',
  props<{ bookId: number }>()
);
export const deleteBookSuccess = createAction(
  '[Book] Delete Book Success',
  props<{ bookId: number }>()
);

export const deleteBookFailure = createAction(
  '[Book] Delete Book Failure',
  props<{ error: any }>()
);

export const resetBookState = createAction('[Book] Reset Book State');

export const setErrorMessage = createAction(
  '[Book] Set Error Message',
  props<{ errorMessage: string }>()
);

export const clearErrorMessage = createAction('[Book] Clear Error Message');


export const reorderBooks = createAction(
  '[Book] Reorder Books',
  props<{ reorderDtos: { bookId: number; order: number }[] }>()
);

export const reorderBooksFailure = createAction(
  '[Book] Reorder Books Failure',
  props<{ error: any }>()
);

export const reorderBooksSuccess = createAction(
  '[Book] Reorder Books Success',
  props<{ books: Book[] }>()
);