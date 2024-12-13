import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthActions, AuthState } from '../..';
import { Subject, filter, takeUntil } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { paths } from '../../../app-paths';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  template: `<button class="logout-button" aria-label="Sign out" (click)="logout()">Logout</button>`,
  styleUrls: ['./logout-button.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
  ],
})
export class LogoutButtonComponent {
  private destroy$ = new Subject<void>();

  constructor(
    private authStore: Store<AuthState>,
    private router: Router,
    private dialogService: DialogService,
    private snackbarService: SnackBarService
  ) { }

  logout(): void {
    this.dialogService
      .openConfirmationDialog({
        title: 'Sign out',
        message: 'Are you sure you want to sign out?',
      })
      .pipe(
        takeUntil(this.destroy$),
        filter(result => result === true)
      )
      .subscribe(() => {
        this.authStore.dispatch(AuthActions.logout());
        this.router.navigate([paths.login]);
        this.snackbarService.openSnackBar('You have successfully logged out.');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
