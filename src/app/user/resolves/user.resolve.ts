import { Injectable, InjectionToken } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { UserActions, UserSelectors } from '..';
import { PlatformService } from '../../auth/services/platform.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolverService {
  constructor(
    private store: Store,
    private platformService: PlatformService
  ) { }

  resolve(): Observable<any> | null {
    if (this.platformService.getIsBrowser()) {
      return this.store.pipe(
        select(UserSelectors.selectIsUserLoaded),
        tap((isUserLoaded) => {
          if (!isUserLoaded) {
            this.store.dispatch(UserActions.getUser());
          }
        }),
        filter(isUserLoaded => isUserLoaded),
        first(),
        catchError(() => {
          this.store.dispatch(UserActions.setUserErrorMessage({ errorMessage: 'Error loading user' }));
          return of(null); // Return null to handle in components
        })
      );
    } else {
      // Optionally handle server-side or non-browser environments differently
      console.log('UserResolver: Skipping load in non-browser environment');
      return of(null);
    }
  }
}
