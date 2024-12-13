import { createAction, props } from '@ngrx/store';
import { Page, PageMode, TransferPagesDto } from '../models/page.models';

/*
 * Page CRUD Functions
 */

// GET PAGES
export const getPages = createAction('[Page] Get Pages');

export const getPagesSuccess = createAction(
  '[Page] Get Pages Success',
  props<{
    pages: Page[];
  }>()
);

export const getPagesFailure = createAction(
  '[Page] Get Pages Failure',
  props<{ errorMessage: string }>()
);

// ADD PAGE
export const addPage = createAction(
  '[Page] Add Page',
  props<{ newPage: Omit<Page, 'createdAt' | 'updatedAt'> }>()
);

export const addPageSuccess = createAction(
  '[Page] Add Page Success',
  props<{ newPageData: Partial<Page> }>()
);

export const addPageFailure = createAction(
  '[Page] Add Page Failure',
  props<{ errorMessage: string }>()
);

// UPDATE PAGE
export const updatePage = createAction(
  '[Page] Update Page',
  props<{ pageId: number; updateData: Partial<Page> }>()  // Use Partial to indicate that not all properties need to be present
);

export const updatePageSuccess = createAction(
  '[Page] Update Page Success',
  props<{ updateData: Partial<Page> }>()
);

export const updatePageFailure = createAction(
  '[Page] Update Page Failure',
  props<{ errorMessage: string }>()
);

// DELETE PAGE
export const deletePage = createAction(
  '[Page] Delete Page',
  props<{ pageId: number }>()
);

export const deletePageSuccess = createAction(
  '[Page] Delete Page Success',
  props<{ id: number }>()
);

export const deletePageFailure = createAction(
  '[Page] Delete Page Failure',
  props<{ errorMessage: string }>()
);

/*
 * Page State Functions
 */

export const clearCurrentBookId = createAction('[Page] Clear Current Book ID');


export const setCurrentBookId = createAction(
  '[Book] Set Selected Book ID',
  props<{ bookId: number }>()
);

export const transferPages = createAction(
  '[Page] Transfer Pages',
  props<{
    transferPagesDto: TransferPagesDto;
  }>()
);

export const transferPagesSuccess = createAction(
  '[Page] Transfer Pages Success',
  props<{
    transferPagesDto: TransferPagesDto;
  }>()
);

export const transferPagesFailure = createAction(
  '[Page] Transfer Pages Failure',
  props<{ errorMessage: string }>()
);

export const setPageMode = createAction(
  '[Page] Set Mode',
  props<{ pageMode: PageMode }>()
);

export const removePageFromStore = createAction(
  '[Page] Remove Unsaved Page',
  props<{ pageIndex: number }>()
);

export const setErrorMessage = createAction(
  '[Page] Set Error Message',
  props<{ errorMessage: string }>()
);

export const addNewPage = createAction(
  '[Page] Add New Page',
  props<{ newPage: Page }>()
);

export const deleteUnsavedPage = createAction(
  '[] Delete Unsaved Page',
  props<{ unsavedPageIndex: number }>()
);

export const reloadPages = createAction('[Page] Reload Pages');

export const resetPageState = createAction('[Page] Reset Page State');
