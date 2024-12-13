import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { HeroSelectors, HeroActions } from '..';
import { PlatformService } from '../../auth/services/platform.service';
import { HeroState } from '../store/hero.reducer';
import { TokenService } from '../../auth/services/token.service';
import { Router } from '@angular/router';
import { paths } from '../../app-paths';

@Injectable({
  providedIn: 'root'
})
export class HeroResolverService {
  constructor(
    private store: Store<HeroState>,
    private platformService: PlatformService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  resolve(): Observable<any> | null {
    if (!this.platformService.getIsBrowser()) {
      console.log('HeroResolver: Skipping load in non-browser environment');
      return of(null);  // Ensure a uniform return type
    }

    const bookId = this.tokenService.getBookId();

    if (!bookId) {
      console.error('HeroResolver: No bookId found, redirecting to bookshelf');
      this.router.navigate([paths.bookshelf]);
      return of(null);
    }

    return this.store.pipe(
      select(HeroSelectors.selectIsHeroLoading),
      tap(isHeroLoading => {
        if (!isHeroLoading) {
          this.store.dispatch(HeroActions.initiateHeroGeneration({ bookId: bookId }));
        }
      }),
      filter(isHeroLoading => isHeroLoading),
      first(),
      catchError((error) => {
        console.error('Error resolving hero data:', error);
        this.store.dispatch(HeroActions.setErrorMessage({ errorMessage: 'Error loading hero data' }));
        return of(null);
      })
    );
  }
}
