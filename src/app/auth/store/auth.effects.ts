import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { paths } from '../../app-paths';
import { AuthActions, AuthState } from '..';
import { TokenService } from '../services/token.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { ProfileActions, ProfileState } from '../../profile';
import { UserState } from '../../user';
import { BookActions, BookState } from '../../book';
import { PageActions, PageState } from '../../page';

@Injectable()
export class AuthEffects {

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService
          .register(action.email, action.password)
          .pipe(
            // tap((response) => console.log("Registration response:", response)), // Log the response
            map(() => AuthActions.registerSuccess()),
            catchError((errorMessage) => of(AuthActions.registerFailure({ errorMessage })))
          )
      )
    )
  );

  registerSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.registerSuccess),
    tap((action) => {
      this.router.navigate([paths.login]).then(() => {
        this.snackbarService.openSnackBar('Registration successful. Please login to continue.', 'close');
      });
    }),
  ), { dispatch: false });


  registerFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerFailure),
      tap((action) => {
        this.errorHandlerService.handleError(action.errorMessage);
      })
    ),
    { dispatch: false }
  );


  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((response) => {

            return AuthActions.loginSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              accessTokenExpireTime: response.accessTokenExpireTime,
              refreshTokenExpireTime: response.refreshTokenExpireTime
            });
          }),
          catchError((errorMessage) => {
            return of(AuthActions.loginFailure({ errorMessage }));
          })
        )
      )
    )
  );

  // loginSuccess$
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap((action) => {
        const { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime } = action;
        this.tokenService.saveTokens(accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime);
        this.tokenService.saveIsAuthenticated(true);
        this.authStore.dispatch(AuthActions.setIsAuthenticated({ isAuthenticated: true }));
        this.router.navigate([paths.bookshelf]);
      }),
      catchError((errorMessage) => of(AuthActions.loginFailure({ errorMessage })))
    ),
    { dispatch: false }
  );


  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap((action) => {
        this.errorHandlerService.handleError(action.errorMessage, 'login');
      })
    ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() => {
        const refreshToken = this.tokenService.getRefreshToken();
        if (refreshToken) {
          return this.authService.refreshToken(refreshToken).pipe(
            map(response => AuthActions.refreshTokenSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              accessTokenExpireTime: response.accessTokenExpireTime,
              refreshTokenExpireTime: response.refreshTokenExpireTime
            })),
            catchError(errorMessage => of(AuthActions.refreshTokenFailure({ errorMessage })))
          );
        } else {
          return of(AuthActions.refreshTokenFailure({
            errorMessage: 'Refresh token is null',
          }));
        }
      }),
      catchError(errorMessage => of(AuthActions.refreshTokenFailure({ errorMessage })))
    )
  );

  refreshTokenSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        concatMap((action) => {
          const {
            accessToken,
            refreshToken,
            accessTokenExpireTime,
            refreshTokenExpireTime
          } = action;
          this.tokenService.saveTokens(accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime);
          this.tokenService.saveIsAuthenticated(true);
          this.authStore.dispatch(
            AuthActions.setIsAuthenticated({ isAuthenticated: true })
          );

          // Possible other actions
          return EMPTY;
        }),
        catchError((errorMessage) => {
          return of(AuthActions.refreshTokenFailure({ errorMessage }));
        })
      ),
    { dispatch: false }
  );

  refreshTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshTokenFailure),
      tap((action) => {
        this.errorHandlerService.handleError(action.errorMessage);
        this.authStore.dispatch(AuthActions.logout());
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((errorMessage) =>
            of(AuthActions.logoutFailure({ errorMessage }))
          )
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate([paths.login])),
        tap(() => this.tokenService.signOut()),
        tap(() => this.authStore.dispatch(AuthActions.resetAuthState())),
        tap(() => this.profileState.dispatch(ProfileActions.resetProfileState())),
        tap(() => this.bookState.dispatch(BookActions.resetBookState())),
        tap(() => this.pageState.dispatch(PageActions.resetPageState())),
      ),
    { dispatch: false }
  );

  resetAuthState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetAuthState),
      tap(() => {
        this.authStore.dispatch(AuthActions.setIsAuthenticated({ isAuthenticated: false }));
        this.tokenService.signOut();
      })
    ),
    { dispatch: false }
  );

  setIsAuthenticated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setIsAuthenticated),
      tap((action) => {
        this.tokenService.saveIsAuthenticated(action.isAuthenticated);
      })
    ),
    { dispatch: false }
  );

  requestPasswordReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.requestPasswordReset),
      mergeMap((action) =>
        this.authService.requestPasswordReset(action.email).pipe(
          // tap(() => console.log('Password reset successful')),
          map(() => AuthActions.passwordResetSuccess()),
          catchError(error => {
            console.error('Password reset failed:', error);
            return of(AuthActions.passwordResetFailure({ errorMessage: error.message || 'Unknown error' }));
          })
        )
      )
    )
  );
  submitPasswordResetCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.submitPasswordResetCode),
      mergeMap((action) =>
        this.authService.submitPasswordResetCode(action.confirmationCode, action.newPassword).pipe(
          map(() => AuthActions.passwordResetSuccess()),
          catchError(error => of(AuthActions.passwordResetFailure({ errorMessage: error.message })))
        )
      )
    )
  );


  sendEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.sendEmail),
      mergeMap((action) =>
        this.authService.sendEmail(action.contactForm).pipe(
          map(() => AuthActions.sendEmailSuccess()),
          catchError(errorMessage => of(AuthActions.sendEmailFailure({ errorMessage })))
        )
      )
    )
  );

  googleLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.googleLogin),
      mergeMap((action) =>
        this.authService.googleLogin(action.idToken).pipe(
          map(response => AuthActions.loginSuccess({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            accessTokenExpireTime: response.accessTokenExpireTime,
            refreshTokenExpireTime: response.refreshTokenExpireTime
          })),
          catchError(errorMessage => of(AuthActions.loginFailure({ errorMessage })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private authStore: Store<AuthState>,
    private profileState: Store<ProfileState>,
    private bookState: Store<BookState>,
    private pageState: Store<PageState>,
    private router: Router,
    private tokenService: TokenService,
    private snackbarService: SnackBarService,
    private errorHandlerService: ErrorHandlerService
  ) { }
}
