import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { User } from '../models/user.models';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { UserActions } from '..';
import { TokenService } from '../../auth/services/token.service';

@Injectable()
export class UserEffects {
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getUser),
      mergeMap(() =>
        this.userService.getUser().pipe(
          map((user: User) => UserActions.getUserSuccess({ user })),
          catchError((errorMessage) =>
            of(UserActions.getUserFailure({ errorMessage }))
          )
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap((action) =>
        this.userService.addUser(action.user).pipe(
          map((user: User) => UserActions.addUserSuccess({ user })),
          catchError((errorMessage) =>
            of(UserActions.addUserFailure({ errorMessage }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.user).pipe(
          tap(({ message }) => {
            this.snackbarService.openSnackBar(message, 'Close');
          }),
          map(({ user }) => UserActions.updateUserSuccess({ user })),
          catchError((errorMessage) => {
            this.snackbarService.openSnackBar('Error updating user', 'Close');
            return of(UserActions.updateUserFailure({ errorMessage }));
          })
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.changePassword),
      mergeMap((action) =>
        this.userService.changePassword(action.oldPassword, action.newPassword).pipe(
          map(() => UserActions.changePasswordSuccess()),
          catchError(errorMessage => of(UserActions.changePasswordFailure({ errorMessage })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private snackbarService: SnackBarService
  ) { }
}
