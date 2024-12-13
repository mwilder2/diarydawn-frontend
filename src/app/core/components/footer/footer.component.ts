import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { paths } from '../../../app-paths';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AboutContactComponent } from '../about-contact/about-contact.component';
import { LogoutButtonComponent } from '../../../auth/components/logout-button/logout-button.component';
import { TokenService } from '../../../auth/services/token.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    AboutContactComponent,
    LogoutButtonComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private destroy$ = new Subject<void>();
  currentYear = new Date().getFullYear();
  appName: string = 'Diary Dawn';
  isAuthenticated$: Observable<boolean>;
  paths = paths;

  constructor(
    private tokenService: TokenService,
  ) {
    this.isAuthenticated$ = this.tokenService.isAuthenticated$;
  }

  ngOnInit() {
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}