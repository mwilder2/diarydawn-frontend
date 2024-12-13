import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private isBrowser: boolean;
  private isBrowserSubject = new BehaviorSubject<boolean>(false);


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getIsBrowser(): boolean {
    return this.isBrowser;
  }

  get isBrowser$(): Observable<boolean> {
    return this.isBrowserSubject.asObservable();
  }
}
