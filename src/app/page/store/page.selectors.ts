import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Page } from '../models/page.models';
import { PageState } from '..';
import { startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { pageFeatureKey } from './page.reducer';

export const selectPageState = createFeatureSelector<PageState>(pageFeatureKey);

/*
 * Pieces of the state
 */

export const selectIsPagesLoaded = createSelector(
  selectPageState,
  (state: PageState) => state.isPagesLoaded
);

export const selectIsLoading = createSelector(
  selectPageState,
  (state: PageState) => state.isLoading
);

export const selectError = createSelector(
  selectPageState,
  (state: PageState) => state.errorMessage
);


export const selectPageCount = createSelector(
  selectPageState,
  (state: PageState) => state.pages
);

export const selectAllPages = createSelector(
  selectPageState,
  (state) => state.pages
);

export const selectPageIds = createSelector(selectAllPages, (pages) =>
  pages.map((page) => page.id)
);

export const selectPageMode = createSelector(
  selectPageState,
  (state: PageState) => state.pageMode
);

export const selectCurrentBookId = createSelector(
  selectPageState,
  (state: PageState) => state.currentBookId
);


export const selectPageById = (id: number) =>
  createSelector(selectPageState, (state: PageState) => {
    if (Array.isArray(state.pages) && state.pages.length > 0) {
      return state.pages.find((page) => page.id === id);
    } else {
      return null;
    }
  });

export const selectFilterPagesByBookId = (bookId: number) =>
  createSelector(selectPageState, (state: PageState) => {
    const bookPages: Page[] = [];

    if (Array.isArray(state.pages) && state.pages.length > 0) {
      state.pages.forEach((page) => {
        if (page.bookId === bookId) {
          bookPages.push(page);
        }
      });
    }

    return bookPages;
  });

export const selectPagesByBookId = createSelector(
  selectPageState,
  (state: PageState) => {
    const selectedBookId = state.currentBookId; // Assuming `currentBookId` is stored in the PageState
    const bookPages: Page[] = [];

    if (!selectedBookId) {
      return bookPages; // Return an empty array if selectedBookId is undefined
    }

    return state.pages.filter(page => page.bookId === selectedBookId);
  }
);

export const selectNumberOfEntries = createSelector(
  selectPageState,
  (state: PageState) => state.pages.length
);

export const selectNumberOfEntriesThisMonth = createSelector(
  selectPageState,
  (state: PageState) => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    let numberOfEntries = 0;

    if (Array.isArray(state.pages) && state.pages.length > 0) {
      state.pages.forEach((page) => {
        const pageDate = new Date(page.date ?? '1970-01-01');
        const pageMonth = pageDate.getMonth();
        const pageYear = pageDate.getFullYear();

        if (pageMonth === thisMonth && pageYear === thisYear) {
          numberOfEntries++;
        }
      });
    }

    return numberOfEntries;
  }
);


export const selectNumberOfEntriesThisWeek = createSelector(
  selectPageState,
  (state: PageState) => {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today);
    const endOfWeekDate = endOfWeek(today);
    let numberOfEntries = 0;

    if (Array.isArray(state.pages) && state.pages.length > 0) {
      state.pages.forEach((page) => {
        const pageDate = page.date ? parseISO(String(page.date)) : null; // Convert page.date to string before parsing

        if (pageDate && pageDate >= startOfWeekDate && pageDate <= endOfWeekDate) {
          numberOfEntries++;
        }
      });
    }
    return numberOfEntries;
  }
);


export const selectAverageNumberOfEntriesPerBook = createSelector(
  selectPageState,
  (state: PageState) => {
    const bookIds: number[] = [];
    const bookIdToNumberOfEntriesMap: Map<number, number> = new Map();

    if (Array.isArray(state.pages) && state.pages.length > 0) {
      state.pages.forEach((page) => {
        if (!bookIds.includes(page.bookId!)) {
          bookIds.push(page.bookId!);
        }
      });

      bookIds.forEach((bookId) => {
        let numberOfEntries = 0;

        state.pages.forEach((page) => {
          if (page.bookId === bookId) {
            numberOfEntries++;
          }
        });

        bookIdToNumberOfEntriesMap.set(bookId, numberOfEntries);
      });
    }

    let totalNumberOfEntries = 0;
    bookIdToNumberOfEntriesMap.forEach((numberOfEntries) => {
      totalNumberOfEntries += numberOfEntries;
    });

    let avgDiariesPerBook = 0;
    if (bookIds.length > 0) {
      avgDiariesPerBook = Number(
        (totalNumberOfEntries / bookIds.length).toFixed(2)
      );
    }

    // console.log('avgDiariesPerBook', avgDiariesPerBook);

    return avgDiariesPerBook;

  }
);

// export const selectIsThisFirstEntryOfDay = createSelector(
//   selectPageState,
//   (state: PageState): boolean => {
//     const today = new Date();
//     const startOfDay = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate()
//     );
//     const endOfDay = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate() + 1
//     );
//     let numberOfEntries = 0;

//     if (Array.isArray(state?.pages) && state.pages.length > 0) {
//       state.pages.forEach((page) => {
//         const pageDate = new Date(page.date ?? '1970-01-01');

//         if (pageDate >= startOfDay && pageDate < endOfDay) {
//           numberOfEntries++;
//         }
//       });
//     }

//     // console.log('numberOfEntriesToday', numberOfEntries);
//     return numberOfEntries === 1;
//   }
// );

export const selectPagesByEntryType = (entryType: string) =>
  createSelector(selectAllPages, (pages) =>
    pages.filter((page) => page.entryTypeData?.entryType === entryType)
  );

export const selectLimitlessPages = selectPagesByEntryType('limitless');
export const selectGratitudePages = selectPagesByEntryType('gratitude');
export const selectAffirmationPages = selectPagesByEntryType('affirmation');
export const selectJourneyPages = selectPagesByEntryType('journey');
export const selectDreamPages = selectPagesByEntryType('dream');
export const selectEmotionPages = selectPagesByEntryType('emotion');
export const selectLessonPages = selectPagesByEntryType('lesson');
