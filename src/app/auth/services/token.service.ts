// Importing required modules from Angular core and ngrx store
import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';
import { PublicHero } from '../../hero/models/hero.models';
import { BehaviorSubject } from 'rxjs';

// Defining constants for token, refresh token, and user keys
const TOKEN_KEY = 'auth_token';
const REFRESHTOKEN_KEY = 'auth_refreshtoken';
const BOOK_ID_KEY = 'current_book_id';
const PUBLIC_HERO_KEY = 'publicHero';
const IS_AUTHENTICATED_KEY = 'is_authenticated';
const ACCESS_TOKEN_EXPIRE_TIME = 'access_token_expire_time';
const REFRESH_TOKEN_EXPIRE_TIME = 'refresh_token_expire_time';
const SESSION_ID = 'sessionId';

// Creating a service for managing token storage
@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor(private platformService: PlatformService) { }
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getIsAuthenticated());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // function to sign out the user by clearing local storage
  signOut(): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.clear();
      this.saveIsAuthenticated(false);
    }
  }

  saveTokens(token: string, refreshToken: string, accessTokenExpireTime: Date, refreshTokenExpireTime: Date): void {
    this.saveAccessToken(token);
    this.saveRefreshToken(refreshToken);
    this.saveAccessTokenExpireTime(accessTokenExpireTime);
    this.saveRefreshTokenExpireTime(refreshTokenExpireTime);
  }

  // function to save access token to local storage
  saveAccessToken(token: string): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
  }

  // function to get access token from local storage
  getAccessToken(): string {
    if (this.platformService.getIsBrowser()) {
      const token = window.localStorage.getItem(TOKEN_KEY);
      return token ? token : '';
    }
    return '';
  }

  saveAccessTokenExpireTime(expireTime: Date): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.setItem(ACCESS_TOKEN_EXPIRE_TIME, String(expireTime));
    }
  }

  getAccessTokenExpireTime(): Date | null {
    if (this.platformService.getIsBrowser()) {
      const expireTime = window.localStorage.getItem(ACCESS_TOKEN_EXPIRE_TIME);
      return expireTime ? new Date(expireTime) : null;
    }
    return null;
  }


  // function to save refresh token to local storage
  saveRefreshToken(token: string): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.setItem(REFRESHTOKEN_KEY, token);
    }
  }


  // function to get refresh token from local storage and wrap it in an Observable
  getRefreshToken(): string {
    if (this.platformService.getIsBrowser()) {
      const token = window.localStorage.getItem(REFRESHTOKEN_KEY);
      return token ? token : '';
    }
    return '';
  }

  // Function to save refresh token expiration time to local storage
  saveRefreshTokenExpireTime(expireTime: Date): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.setItem(REFRESH_TOKEN_EXPIRE_TIME, String(expireTime));
    }
  }

  // Function to get refresh token expiration time from local storage
  getRefreshTokenExpireTime(): Date | null {
    if (this.platformService.getIsBrowser()) {
      const expireTime = window.localStorage.getItem(REFRESH_TOKEN_EXPIRE_TIME);
      return expireTime ? new Date(expireTime) : null;
    }
    return null;
  }



  // Save bookId to local storage and update the BehaviorSubject
  saveBookId(bookId: number): void {
    if (this.platformService.getIsBrowser()) {
      window.localStorage.setItem(BOOK_ID_KEY, String(bookId));
    }
  }

  // Retrieve the initial bookId from local storage
  getBookId(): number | null {
    if (this.platformService.getIsBrowser()) {
      const bookId = window.localStorage.getItem(BOOK_ID_KEY);
      return bookId ? parseInt(bookId, 10) : null;
    }
    return null;
  }

  saveIsAuthenticated(isAuthenticated: boolean): void {
    if (this.platformService.getIsBrowser()) {
      window.sessionStorage.setItem(IS_AUTHENTICATED_KEY, isAuthenticated.toString());
      this.isAuthenticatedSubject.next(isAuthenticated);
    }
  }

  getIsAuthenticated(): boolean {
    if (this.platformService.getIsBrowser()) {
      let isAuthenticated = window.sessionStorage.getItem(IS_AUTHENTICATED_KEY);
      if (isAuthenticated === 'true')
        return true;
    }
    return false;
  }

  saveSessionId(sessionId: string): void {
    if (this.platformService.getIsBrowser()) {
      window.sessionStorage.setItem(SESSION_ID, sessionId);
    }
  }

  getSessionId(): string {
    if (this.platformService.getIsBrowser()) {
      return window.sessionStorage.getItem(SESSION_ID) || '';
    }
    return '';
  }


  savePublicHero(results: PublicHero[]): void {
    if (this.platformService.getIsBrowser()) {
      window.sessionStorage.setItem(PUBLIC_HERO_KEY, JSON.stringify(results));
    }
  }

  getPublicHero(): PublicHero[] | null {
    if (this.platformService.getIsBrowser()) {
      const results = window.sessionStorage.getItem(PUBLIC_HERO_KEY);
      return results ? JSON.parse(results) : null;
    }
    return null;
  }

  clearPublicHero(): void {
    if (this.platformService.getIsBrowser()) {
      window.sessionStorage.removeItem(PUBLIC_HERO_KEY);
    }
  }
}
