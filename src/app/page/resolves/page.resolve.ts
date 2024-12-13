import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { PageState } from '../store/page.reducer';
import { PageActions, PageSelectors } from '..';
import { PlatformService } from '../../auth/services/platform.service';
import { PageMode } from '../models/page.models';

@Injectable({
  providedIn: 'root'
})
export class PageResolverService {
  constructor(
    private store: Store<PageState>,
    private platformService: PlatformService
  ) { }

  resolve(): Observable<any> | null {
    if (this.platformService.getIsBrowser()) {
      return this.store.pipe(
        select(PageSelectors.selectIsPagesLoaded),
        tap((isPagesLoaded) => {
          // Set the diary mode to previous entry as part of the initial check for page loading
          this.store.dispatch(PageActions.setPageMode({ pageMode: PageMode.PREVIOUS_ENTRY }));

          if (!isPagesLoaded) {
            this.store.dispatch(PageActions.getPages());
          }
        }),
        filter((isPagesLoaded) => isPagesLoaded),
        first(),
        catchError(() => {
          this.store.dispatch(PageActions.setErrorMessage({ errorMessage: 'Error loading pages' }));
          return of(null); // Return null to handle in components
        })
      );
    } else {
      // Log or handle the server-side differently
      console.log('PageResolver: Skipping load in non-browser environment');
      return of(null);
    }
  }
}
