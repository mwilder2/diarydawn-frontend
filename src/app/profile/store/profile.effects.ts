import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProfileService } from '..';
import { ProfileActions } from '..';

@Injectable()
export class ProfileEffects {
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.getProfile),
      switchMap(() =>
        this.profileService.getProfile().pipe(
          map((profile) => ProfileActions.getProfileSuccess({ profile })),
          catchError((error) =>
            of(
              ProfileActions.getProfileFailure({ errorMessage: error.message })
            )
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap((action) =>
        this.profileService.updateProfile(action.profile).pipe(
          map((profile) => ProfileActions.updateProfileSuccess({ profile })),
          catchError((error) =>
            of(
              ProfileActions.updateProfileFailure({
                errorMessage: error.message,
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private profileService: ProfileService
  ) { }
}
