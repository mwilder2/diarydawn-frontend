import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions, AuthState } from '../..';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SnackBarService } from '../../../shared/services/snackbar.service';


@Component({
  selector: 'register',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    RouterOutlet,

  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class registerComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  private destroy$ = new Subject<void>();
  isAuthenticated$: Observable<boolean>;
  isLoggedIn: boolean = false;

  constructor(private fb: FormBuilder,
    private authState: Store<AuthState>,
    private tokenService: TokenService,
    private snackBarService: SnackBarService,
  ) {
    this.isAuthenticated$ = this.tokenService.isAuthenticated$;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    });
    this.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
      });
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoggedIn) {
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.authState.dispatch(AuthActions.register({ email, password }));
    } else {
      this.snackBarService.openSnackBar('Please log out before registering a new account', 'close');
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
