import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { sendEmailDto } from '../models/email.mode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUrl = environment.authUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}register`, {
      email,
      password,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}login`, { email, password });
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(`${this.authUrl}refresh`, {
      token: token,
    });
  }

  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken) {
      return this.http.post<void>(`${this.authUrl}logout`, {
        refreshToken: refreshToken,
      });
    } else {
      return of(null);
    }
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}request-password-reset`, { email });
  }

  submitPasswordResetCode(confirmationCode: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.authUrl}submit-password-reset-code`, {
      confirmationCode,
      newPassword,
    });
  }

  sendEmail(contactForm: sendEmailDto): Observable<any> {
    return this.http.post(`${this.authUrl}send-email`, contactForm);
  }

  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${this.authUrl}google-login`, { idToken });
  }
}
