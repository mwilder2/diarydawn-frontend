import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { HeroState } from '../store/hero.reducer';
import { HeroActions } from '..';
import { Subject } from 'rxjs';
import { PublicHero, Hero } from '../models/hero.models';
import { PlatformService } from '../../auth/services/platform.service';
import { TokenService } from '../../auth/services/token.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PublicGateWayService {
  private socket!: Socket;
  private publicHeroSubject = new Subject<PublicHero[]>();

  constructor(
    private platformService: PlatformService,
    private heroStore: Store<HeroState>,
    private tokenService: TokenService,
    private http: HttpClient
  ) { }

  connect() {
    if (this.platformService.getIsBrowser()) {
      const socketUrl = environment.baseUrl;
      // console.log('Connecting to WebSocket server...', socketUrl);
      const sesstionId = this.generateSessionId();
      this.socket = io(socketUrl, {
        path: '/public',
        query: { sessionId: sesstionId },
      });
      this.setupEventListeners();
    }
  }

  private generateSessionId(): string {
    return this.tokenService.getSessionId() || this.createAndStoreSessionId();
  }

  private createAndStoreSessionId(): string {
    const newId = Math.random().toString(36).substring(2, 15);
    this.tokenService.saveSessionId(newId);
    return newId;
  }


  private setupEventListeners() {
    this.socket.on('connect', () => {
      // console.log('Connected to WebSocket server!');
      this.listenForPublicHero();
    });
  }


  // private listenForHero() {
  //   this.socket.on('hero', (publicHero: Hero[]) => {
  //     this.heroStore.dispatch(HeroActions.setHero({ superPowers: publicHero }));
  //     this.heroStore.dispatch(HeroActions.setIsHeroLoading({ isHeroLoading: false }));
  //   });
  // }

  private listenForPublicHero() {
    this.socket.on('public-hero', (publicHero: PublicHero[]) => {
      this.heroStore.dispatch(HeroActions.setIsHeroLoading({ isHeroLoading: false }));
      this.publicHeroSubject.next(publicHero);
    });
  }

  getPublicHeroObservable() {
    return this.publicHeroSubject.asObservable();
  }


  disconnect() {
    if (this.socket) {
      console.log('Disconnecting from WebSocket server...');
      const sessionId = this.tokenService.getSessionId();
      if (sessionId) {
        this.http.post(`${environment.authUrl}end-session`, { sessionId })
          .subscribe({
            next: () => console.log('Session ended successfully'),
            error: (error) => console.log('Error ending session', error)
          });
      }
      this.socket.disconnect();
    }
  }
}
