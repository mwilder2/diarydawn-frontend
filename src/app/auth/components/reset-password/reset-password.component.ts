import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { AuthActions, AuthSelectors } from '../..';
import { AuthState } from '../../store/auth.reducer';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { SnackBarService } from '../../../shared/services/snackbar.service';
import { skip, switchMap, take, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    RouterOutlet,
  ],
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  currentStep = 1;

  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  resetForm = new FormGroup({
    resetCode: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(
    private store: Store<AuthState>,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.currentStep = 2; // Move directly to step 2 if a code is present
        const resetCodeControl = this.resetForm.get('resetCode');
        if (resetCodeControl) {
          resetCodeControl.setValue(code); // Set the reset code automatically
        }
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.currentStep = 2; // Move directly to step 2 if a code is present
        const resetCodeControl = this.resetForm.get('resetCode');
        if (resetCodeControl) {
          resetCodeControl.setValue(code); // Set the reset code automatically
        }
      }
    });
  }

  requestPasswordReset(step: number) {
    if (this.emailForm.valid) {
      this.currentStep = step;
      this.store.dispatch(AuthActions.requestPasswordReset({ email: this.emailForm.value.email! }));

      // Observe the password reset status
      this.store.select(AuthSelectors.getPasswordResetStatus).pipe(
        skip(1), // Skip 'pending'
        take(1),
      ).subscribe(status => {
        if (status === 'success') {
          this.snackBarService.openSnackBar('If your email address is associated with an account, we have sent a password reset link.', 'Close');
        } else {
          this.snackBarService.openSnackBar('There was an error processing your request. Please try again later.', 'Close');
        }
      });
    } else {
      this.snackBarService.openSnackBar('Please enter a valid email address.', 'Close');
    }
  }


  finalizeReset() {
    if (this.resetForm.valid) {
      this.store.dispatch(AuthActions.submitPasswordResetCode({
        confirmationCode: this.resetForm.value.resetCode!,
        newPassword: this.resetForm.value.newPassword!
      }));
      this.currentStep = 3;
    }
  }

  resetStepper() {
    this.currentStep = 1;
    this.emailForm.reset();
    this.resetForm.reset();
  }
}