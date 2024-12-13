import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Socket, io } from "socket.io-client";
import { HeroActions } from "..";
import { PlatformService } from "../../auth/services/platform.service";
import { TokenService } from "../../auth/services/token.service";
import { environment } from "../../environments/environment";
import { Hero } from "../models/hero.models";
import { HeroState } from "../store/hero.reducer";

@Injectable({
  providedIn: 'root'
})
export class AuthGatewayService {
  private socket!: Socket;

  constructor(
    private platformService: PlatformService,
    private heroStore: Store<HeroState>,
    private tokenService: TokenService,
  ) { }

  connectAuthUser() {
    if (this.platformService.getIsBrowser()) {
      const socketUrl = environment.baseUrl;
      console.log('Connecting to WebSocket server...', socketUrl);
      const token = this.tokenService.getAccessToken();

      if (!token) {
        console.log('No token provided by the client');
        return;
      }

      this.socket = io(socketUrl, {
        path: '/auth',
        query: { token: token },
      });
      this.setupEventListeners();
    }
  }

  private setupEventListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to Auth WebSocket server!');
      this.listenForHero();
    });
  }

  private listenForHero() {
    this.socket.on('hero', (hero: Hero[]) => {
      this.heroStore.dispatch(HeroActions.setHero({ superPowers: hero }));
      this.heroStore.dispatch(HeroActions.setIsHeroLoading({ isHeroLoading: false }));
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting from Auth WebSocket server...');
      this.socket.disconnect();
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
