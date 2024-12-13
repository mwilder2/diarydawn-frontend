import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, catchError, map, of, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { paths } from '../../../app-paths';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { HeroActions, HeroSelectors, HeroState } from '../..';
import { ChatgptInterfaceComponent } from '../chatgpt-interface/chatgpt-interface.component';
import { TokenService } from '../../../auth/services/token.service';
import { BookActions, BookSelectors, BookState } from '../../../book';
import { PublicGateWayService } from '../../services/public.gateway.service';
import { Hero } from '../../models/hero.models';
import { PageActions, PageState } from '../../../page';
import { AuthGatewayService } from '../../services/gateway.service';

declare var FB: any; // Declare FB to avoid TypeScript errors


@Component({
  selector: 'app-one-of-you',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    ChatgptInterfaceComponent
  ],
  templateUrl: './one-of-you.component.html',
  styleUrls: ['./one-of-you.component.scss'],
})
export class OneOfYouComponent implements OnInit {
  paths = paths;
  bookId: number | null = null;
  isHeroLoading$: Observable<boolean>;
  hero$: Observable<Hero[]>; // Observable for the hero
  subscription!: Subscription;
  isAuthenticated: boolean | null = null;
  downloadUrl: string | null = null;
  private destroy$ = new Subject<void>();


  constructor(
    private pageStore: Store<PageState>,
    private heroStore: Store<HeroState>,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackBarService,
    private tokenService: TokenService,
    private authGatewayService: AuthGatewayService,
  ) {
    this.authGatewayService.connectAuthUser();
    this.isHeroLoading$ = this.heroStore.select(HeroSelectors.selectIsHeroLoading);
    this.hero$ = this.heroStore.select(HeroSelectors.selectAllHeroes);  // Assigning the Observable from store
  }

  ngOnInit() {
    this.bookId = this.tokenService.getBookId();

    // Subscribe to the imageUrl in the component
    this.heroStore.select(HeroSelectors.selectImageUrl).subscribe((url) => {
      this.downloadUrl = url;
    });
  }

  emailResults() {
    if (this.bookId) {
      this.heroStore.dispatch(HeroActions.emailHero({ bookId: this.bookId }));
    } else {
      console.error('No bookId available');
    }
  }

  backToBookshelf(): void {
    this.router.navigate([this.paths.bookshelf]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}