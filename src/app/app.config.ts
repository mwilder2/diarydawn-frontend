import { APP_INITIALIZER, ApplicationConfig, PLATFORM_ID, importProvidersFrom, isDevMode } from '@angular/core';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Store, provideState, provideStore, select } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { GuidedTourModule, GuidedTourService } from 'ngx-guided-tour';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { authFeatureKey } from './auth';
import { AuthEffects } from './auth/store/auth.effects';
import { authReducer } from './auth/store/auth.reducer';
import { BookEffects } from './book/store/book.effects';
import { bookFeatureKey, bookReducer } from './book/store/book.reducer';
import { HeroEffects } from './hero/store/hero.effects';
import { heroFeatureKey, heroReducer } from './hero/store/hero.reducer';
import { PageEffects } from './page/store/page.effects';
import { pageFeatureKey, pageReducer } from './page/store/page.reducer';
import { ProfileEffects } from './profile/store/profile.effects';
import { profileFeatureKey, profileReducer } from './profile/store/profile.reducer';
import { userFeatureKey } from './user';
import { UserEffects } from './user/store/user.effects';
import { userReducer } from './user/store/user.reducer';
import { provideClientHydration } from '@angular/platform-browser';
import { ProfileResolverService } from './profile/resolves/profile.resolve';
import { PageResolverService } from './page/resolves/page.resolve';
import { BookResolverService } from './book/resolves/book.resolve';
import { UserResolverService } from './user/resolves/user.resolve';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { DiaryTypeCountPipe } from './page/pipes/entry-type-count.pipe';
import { MaterialModule } from './material.module';
import { HeroResolverService } from './hero/resolves/hero.resolve';
import { DisabledTooltipDirective } from './shared/directives/disabled-tooltip.directive';
import { MatTooltip } from '@angular/material/tooltip';
// import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import {
//   GoogleLoginProvider,
// } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [

    importProvidersFrom(HttpClientModule),
    provideHttpClient(withFetch()),
    provideRouter(routes,
      withPreloading(PreloadAllModules),
      withDebugTracing(),
    ),
    // provideRouterStore(),
    provideStore({}),
    provideEffects(),

    provideState(authFeatureKey, authReducer),
    provideEffects(AuthEffects),

    provideState(bookFeatureKey, bookReducer),
    provideEffects(BookEffects),

    provideState(pageFeatureKey, pageReducer),
    provideEffects(PageEffects),

    provideState(userFeatureKey, userReducer),
    provideEffects(UserEffects),

    provideState(profileFeatureKey, profileReducer),
    provideEffects(ProfileEffects),

    provideState(heroFeatureKey, heroReducer),
    provideEffects(HeroEffects),

    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),

    provideClientHydration(),
    provideAnimationsAsync(),

    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(
    //           '200199811389-ou82qonjgmegp9o0tf46f2p4157j2d29.apps.googleusercontent.com'
    //         )
    //       }
    //     ],
    //     onError: (error: any) => {
    //       console.error(error);
    //     }
    //   } as SocialAuthServiceConfig,
    // },

    // Resolves
    ProfileResolverService,
    UserResolverService,
    BookResolverService,
    PageResolverService,
    HeroResolverService,

    // Pipes
    DiaryTypeCountPipe,
    DatePipe,
    MatTooltip,

    importProvidersFrom(

      GuidedTourModule,
      MaterialModule,
    ),
    // Services
    GuidedTourService,

    // Directives
    DisabledTooltipDirective,
  ],
};