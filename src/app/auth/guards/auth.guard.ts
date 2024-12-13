import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { PlatformService } from '../services/platform.service';
import { SnackBarService } from '../../shared/services/snackbar.service';
import { paths, whitelist } from '../../app-paths';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private snackBarService: SnackBarService,
    private platformService: PlatformService,
  ) { }

  private isWhitelisted(url: string): boolean {
    return whitelist.some(path => url.includes(path));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (!this.platformService.getIsBrowser()) {
      console.log('Not a browser environment, skipping auth guard');
      return false;
    }

    if (this.isWhitelisted(state.url)) {
      return true;
    }

    const isAuthenticated = this.tokenService.getIsAuthenticated();
    if (!isAuthenticated) {
      this.snackBarService.openSnackBarWithClass(
        'Please log in to access this page',
        'Close',
        'error-snackbar'
      );
      this.router.navigate([paths.login]);
      return false;
    }

    return true;
  }

  private handleErrors(error: any): Observable<boolean> {
    console.error('Authentication guard error:', error);
    this.snackBarService.openSnackBarWithClass(
      'An error occurred during authentication',
      'Close',
      'error-snackbar'
    );
    this.router.navigate([paths.login]);
    return of(false);
  }
}