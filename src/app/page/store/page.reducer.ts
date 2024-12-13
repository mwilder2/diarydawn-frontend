import { Action, createReducer, on } from '@ngrx/store';
import { PageActions } from '..';
import { Page, PageMode } from '../models/page.models';

export const pageFeatureKey = 'page';

export interface PageState {
  pages: Page[];
  pageMode: PageMode;
  currentBookId: number | null;
  isPagesLoaded: boolean;
  isLoading: boolean;
  errorMessage: string | null;
}

export const initialPageState: PageState = {
  pages: [],
  pageMode: PageMode.PREVIOUS_ENTRY,
  currentBookId: null,
  isPagesLoaded: false,
  isLoading: false,
  errorMessage: null,
};

export const reducer = createReducer(
  initialPageState,
  on(PageActions.getPages, (state) => ({
    ...state,
    isLoading: true,
    isPagesLoaded: false,
  })),
  on(PageActions.getPagesSuccess, (state, { pages }) => {
    const updatedState = {
      ...state,
      pages: pages,
      isLoading: false,
    };
    return updatedState;
  }),
  on(PageActions.getPagesFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
    isPagesLoaded: true,
    isLoading: false,
    pageMode: PageMode.PREVIOUS_ENTRY
  })),
  on(PageActions.addPage, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(PageActions.addPageSuccess, (state, { newPageData }) => {
    const pageData = state.pages.map(page =>
      page.id === newPageData.id ? { ...page, ...newPageData } : page
    );
    return {
      ...state,
      pages: pageData,
    };
  }),
  on(PageActions.addPageFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
    isLoading: false,
  })),
  on(PageActions.updatePage, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(PageActions.updatePageSuccess, (state, { updateData }) => {
    const updatedPages = state.pages.map(page =>
      page.id === updateData.id ? { ...page, ...updateData } : page
    );
    return {
      ...state,
      pages: updatedPages,
    };
  }),
  on(PageActions.updatePageFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
    isLoading: false,
  })),
  on(PageActions.deletePageSuccess, (state, { id }) => {
    const updatedState = {
      ...state,
      pages: state.pages.filter((p) => p.id !== id),
      pageMode: PageMode.PREVIOUS_ENTRY
    };
    return updatedState;
  }),
  on(PageActions.deletePageFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(
    PageActions.transferPagesSuccess,
    (state, { transferPagesDto }) => {
      // Extract values from DTO
      const { sourceBookId, targetBookId, transferringPageIds, deleteSourceBook } = transferPagesDto;

      // Update the bookId of the transferred pages
      const updatedPages = state.pages.map((page) => {
        if (transferringPageIds.includes(page.id!)) {
          return { ...page, bookId: targetBookId };
        }
        return page;
      });

      // If deleteSourceBook is true, filter out pages with the sourceBookId
      if (deleteSourceBook) {
        return {
          ...state,
          pages: updatedPages.filter((page) => page.bookId !== sourceBookId),
        };
      }

      return {
        ...state,
        pages: updatedPages,
      };
    }
  ),
  on(PageActions.transferPagesFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(PageActions.removePageFromStore, (state, { pageIndex }) => {
    const updatedPages = [...state.pages];
    updatedPages.splice(pageIndex, 1);
    return { ...state, pages: updatedPages };
  }),
  on(PageActions.setErrorMessage, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(PageActions.addNewPage, (state, { newPage }) => {
    const updatedPages = [...state.pages];
    updatedPages.push(newPage);
    return {
      ...state,
      pages: updatedPages,
      pageMode: PageMode.NEW_ENTRY
    };
  }),
  on(PageActions.deleteUnsavedPage, (state, { unsavedPageIndex }) => {
    const updatedPages = [...state.pages];
    updatedPages.splice(unsavedPageIndex, 1);

    return {
      ...state,
      pages: updatedPages,
      pageMode: PageMode.PREVIOUS_ENTRY
    };
  }),
  on(PageActions.resetPageState, (state) => ({
    ...state,
    pages: [],
    isPagesLoaded: false,
    isLoading: false,
    errorMessage: null,
  })),
  on(PageActions.setPageMode, (state, { pageMode }) => ({
    ...state,
    pageMode: pageMode,
  })
  ),
  on(PageActions.clearCurrentBookId, (state) => ({
    ...state,
    currentBookId: null,
  })),
  on(PageActions.setCurrentBookId, (state, { bookId }) => ({
    ...state,
    currentBookId: bookId,
  })),
  on(PageActions.reloadPages, (state) => ({
    ...state,
    isPagesLoaded: true,
    pageMode: PageMode.PREVIOUS_ENTRY
  })
  )
);

export function pageReducer(state: PageState | undefined, action: Action) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: PageState | undefined, action: Action) {
  console.log('Page state', state);
  console.log('Page action', action);

  return reducer(state, action);
}