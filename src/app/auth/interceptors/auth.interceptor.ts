import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors, AuthState } from '..';
import { whitelist } from '../../app-paths';
import { PlatformService } from '../services/platform.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;

  constructor(
    private tokenService: TokenService,
    private authStore: Store<AuthState>,
    private platformService: PlatformService
  ) { }

  private addAuthToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private isWhitelisted(url: string): boolean {
    return whitelist.some(path => url.includes(path));
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.platformService.getIsBrowser()) {
      console.log('Not a browser environment, skipping auth interceptor');
      return next.handle(req);
    }

    let authReq = req;
    const currentTime = Date.now();
    const accessTokenExpiration = this.tokenService.getAccessTokenExpireTime();

    if (accessTokenExpiration && (accessTokenExpiration.getTime() - 300000) < currentTime) {
      if (!this.refreshTokenInProgress) {
        this.refreshTokenInProgress = true;
        return this.handle401Error(authReq, next).pipe(
          catchError(error => {
            // Sign out only if refresh token fails
            if (error instanceof HttpErrorResponse && error.status === 401) {
              this.tokenService.signOut();
            }
            return throwError(() => error);
          }),
          finalize(() => this.refreshTokenInProgress = false)
        );
      }
    }

    const token = this.tokenService.getAccessToken();
    if (token) {
      authReq = this.addAuthToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && !this.isWhitelisted(req.url) && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        console.error('HTTP Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authStore.select(AuthSelectors.selectIsRefreshing).pipe(
      take(1),
      switchMap(isRefreshing => {
        if (!isRefreshing && !this.refreshTokenInProgress) {
          this.refreshTokenInProgress = true;
          this.authStore.dispatch(AuthActions.refreshToken());
        }
        return this.authStore.select(AuthSelectors.selectAccessToken).pipe(
          filter(token => token != null),
          take(1),
          switchMap(token => next.handle(this.addAuthToken(request, token!))),
          catchError(error => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              this.tokenService.signOut();
              return throwError(() => error);
            }
            return throwError(() => error);
          }),
          finalize(() => this.refreshTokenInProgress = false)
        );
      })
    );
  }
}

