import { Injectable, InjectionToken } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { ProfileActions, ProfileSelectors, ProfileState } from '..';
import { PlatformService } from '../../auth/services/platform.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileResolverService {
  constructor(
    private store: Store<ProfileState>,
    private platformService: PlatformService
  ) { }

  resolve(): Observable<any> | null {
    if (this.platformService.getIsBrowser()) {
      return this.store.pipe(
        select(ProfileSelectors.selectIsProfileLoaded),
        tap((isProfileLoaded) => {
          if (!isProfileLoaded) {
            this.store.dispatch(ProfileActions.getProfile());
          }
        }),
        filter(isProfileLoaded => isProfileLoaded),
        first(),
        catchError(() => {
          this.store.dispatch(ProfileActions.setErrorMessage({ errorMessage: 'Error loading profile' }));
          return of(null);
        })
      );
    } else {
      // Optionally handle server-side or non-browser environments differently
      console.log('ProfileResolver: Skipping load in non-browser environment');
      return of(null);
    }
  }
}
