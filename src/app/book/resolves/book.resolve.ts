import { Inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { Observable, catchError, filter, first, map, of, switchMap, tap } from 'rxjs';
import { BookActions, BookSelectors, BookState } from '..';
import { Store, select } from '@ngrx/store';
import { isPlatformBrowser } from '@angular/common';
import { PlatformService } from '../../auth/services/platform.service';


@Injectable({
  providedIn: 'root'
})
export class BookResolverService {
  constructor(
    private store: Store<BookState>,
    private platformService: PlatformService
  ) { }

  resolve(): Observable<any> | null {
    if (this.platformService.getIsBrowser()) {
      return this.store.pipe(
        select(BookSelectors.selectIsBooksLoaded),
        filter(isBooksLoaded => {
          if (!isBooksLoaded) {
            this.store.dispatch(BookActions.getBooks());
          }
          return isBooksLoaded;
        }),
        first(),
        catchError(() => {
          this.store.dispatch(BookActions.setErrorMessage({ errorMessage: 'Error loading books' }));
          return of(null);
        })
      );
    } else {
      // Optionally handle server-side or non-browser environments differently
      console.log('BookResolver: Skipping load in non-browser environment');
      return of(null);
    }
  }
}
