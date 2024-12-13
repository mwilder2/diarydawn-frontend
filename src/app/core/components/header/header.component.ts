import { Component, OnDestroy, OnInit } from '@angular/core';
import { paths } from '../../../app-paths';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LogoutButtonComponent } from '../../../auth/components/logout-button/logout-button.component';
import { TokenService } from '../../../auth/services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    LogoutButtonComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  paths = paths;
  isAuthenticated: boolean | null = null;
  isAuthenticated$: Observable<boolean>;
  private destroy$ = new Subject<void>();

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