import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageNotFoundComponent } from './auth/components/page-not-found/page-not-found.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { HeaderComponent } from './core/components/header/header.component';
import { HomePageComponent } from './core/components/home/home.component';
import { PublicGateWayService } from './hero/services/public.gateway.service';
import { TokenService } from './auth/services/token.service';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { paths } from './app-paths';
import { PlatformService } from './auth/services/platform.service';
import { AuthActions, AuthState } from './auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HomePageComponent,
    FooterComponent,
    HeaderComponent,
    PageNotFoundComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private gateWayService: PublicGateWayService,
    private tokenService: TokenService,
    private router: Router,
    private platformService: PlatformService,
    private authStore: Store<AuthState>
  ) { }

  ngOnInit() {
    if (this.platformService.getIsBrowser()) {
      this.initializeSession();
    }
  }

  ngOnDestroy() {
    this.gateWayService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSession(): void {
    const refreshToken = this.tokenService.getRefreshToken();
    const refreshTokenExpireTime = this.tokenService.getRefreshTokenExpireTime();

    if (refreshToken && refreshTokenExpireTime && new Date() < refreshTokenExpireTime) {
      this.authStore.dispatch(AuthActions.refreshToken());
      this.tokenService.isAuthenticated$.pipe(
        filter(isAuthenticated => isAuthenticated),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        const navigated = sessionStorage.getItem('navigated');
        if (!navigated) {
          sessionStorage.setItem('navigated', 'true');
          this.router.navigate(['/bookshelf']);
        }
      });
    } else {
      sessionStorage.removeItem('navigated');
      // this.router.navigate(['/']);
    }
  }

}