import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { TokenService } from '../../auth/services/token.service';
import { Router } from '@angular/router';
import { HeroActions, HeroState, HeroService } from '..';
import { paths } from '../../app-paths';

@Injectable()
export class HeroEffects {
  deleteSuperPower$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.deleteSuperPower),
      switchMap(({ superPowerId: superPowerId }) =>
        this.heroService.deleteSuperPower(superPowerId).pipe(
          tap(({ message }) => {
            this.snackbarService.openSnackBar(message, 'close');
          }),
          map(() => HeroActions.deleteSuperPowerSuccess({ superPowerId: superPowerId })),
          catchError((error) => {
            this.snackbarService.openSnackBar('Error deleting book', 'close');
            return of(HeroActions.deleteSuperPowerFailure({ error }));
          })
        )
      )
    )
  );

  initiateHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.initiateHeroGeneration),
      mergeMap((action) =>
        this.heroService.startHeroProcess(action.bookId).pipe(
          tap(({ message }) => {
            // Optionally show a message to the user
            this.snackbarService.openSnackBar(message, 'Close');
          }),
          map(({ id, message }) => {
            // Optionally handle the ID and message, if needed for further actions
            this.router.navigate(['/one-of-you']); // Navigate to the 'one-of-you' component
            return HeroActions.heroGenerationInitiated({ message });
          }),
          catchError((error) => {
            this.snackbarService.openSnackBar('Error initiating discover your superpowers', 'Close');
            return of(HeroActions.heroGenerationFailed({ error })); // Handle the error case
          })
        )
      )
    )
  );

  fetchHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.fetchHero),
      map(() => this.tokenService.getBookId()),
      switchMap(bookId => {
        if (bookId === null) {
          console.error('No bookId available to fetch hero');
          return of(HeroActions.noop());  // Dispatch a noop action
        }
        return this.heroService.getHeroByBookId(bookId).pipe(
          map(superPowers => HeroActions.fetchHeroSuccess({ superPowers })),
          catchError(error => of(HeroActions.fetchHeroFailure({ error })))
        );
      })
    )
  );

  heroGenerationFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.heroGenerationFailed),
      tap(({ error }) => {
        this.router.navigate([paths.bookshelf]);  // Navigate to the 'bookshelf' component
        this.snackbarService.openSnackBar('Error generating hero', 'close');
      })
    ),
    { dispatch: false }
  );



  emailHero$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HeroActions.emailHero),
      switchMap(({ bookId }) =>
        this.heroService.emailHero(bookId).pipe(
          tap((response) => {
            this.snackbarService.openSnackBar(response.message, 'close');
          }),
          map((response) => HeroActions.emailHeroSuccess({ imageUrl: response.imageUrl })),
          catchError((error) => {
            console.error('Error in emailHero:', error);  // Log any errors
            this.snackbarService.openSnackBar('Error emailing hero results', 'close');
            return of(HeroActions.emailHeroFailure({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private heroService: HeroService,
    private heroStore: Store<HeroState>,
    private router: Router,
    private snackbarService: SnackBarService,
    private tokenService: TokenService
  ) {
  }
}
