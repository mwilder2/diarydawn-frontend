import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from '../../auth/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private heroUrl = environment.heroUrl;
  private authUrl = environment.authUrl;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  sendMessage(prompt: string): Observable<string> {
    const isAuthenticated = this.tokenService.getIsAuthenticated();

    const endpoint = isAuthenticated
      ? `${this.heroUrl}generate-response`
      : `${this.authUrl}generate-public-response`;

    return this.http.post<string>(endpoint, { prompt }, { responseType: 'text' as 'json' });
  }
}