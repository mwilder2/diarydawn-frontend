import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { PublicHero, Hero, EmailHeroResponse } from '../models/hero.models';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  heroUrl = environment.heroUrl;
  authUrl = environment.authUrl;
  sharingUrl = environment.sharingUrl;

  constructor(
    private http: HttpClient
  ) { }


  deleteSuperPower(superPowerId: number): Observable<{ id: number, message: string }> {
    return this.http.delete<{ id: number, message: string }>(
      `${this.heroUrl}delete/${superPowerId}`
    );
  }

  startHeroProcess(BookId: number): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(
      `${this.heroUrl}generate-hero/${BookId}`,
      {}
    );
  }

  getHeroByBookId(bookId: number): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.heroUrl}hero/${bookId}`);
  }

  emailHero(bookId: number): Observable<EmailHeroResponse> {
    return this.http.post<EmailHeroResponse>(`${this.sharingUrl}email-hero/${bookId}`, {});
  }

  // public api call for Hero, no auth required
  initiatePublicHero(text: string, sessionId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authUrl}public-hero`, { text: text, sessionId: sessionId });
  }

  emailPublicHero(email: string, publicHero: PublicHero[]): Observable<EmailHeroResponse> {
    return this.http.post<EmailHeroResponse>(`${this.authUrl}email-public-hero`, { email, publicHero: publicHero, });
  }


  getFacebookShareUrl(email: string, publicHero: PublicHero[], shareTo: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.authUrl}facebook-public-hero`, { email, publicHero: publicHero, shareTo })
      .pipe(
        map(response => response),
        tap(response => console.log('Facebook share URL:', response)),
        catchError(error => {
          console.error('Error getting Facebook share URL:', error);
          return throwError(() => error);
        })
      );
  }
}
