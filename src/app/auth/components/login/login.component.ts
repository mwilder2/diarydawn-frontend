import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions, AuthState } from '../..';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SnackBarService } from '../../../shared/services/snackbar.service';
// import { SocialAuthService, GoogleSigninButtonModule, SocialUser, GoogleLoginProvider } from '@abacritt/angularx-social-login';

@Component({
  selector: 'login',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    // GoogleSigninButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class loginComponent implements OnInit {
  loginForm!: FormGroup;
  // user: SocialUser = new SocialUser;
  loggedIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authState: Store<AuthState>,
    // private authService: SocialAuthService,
  ) {
  }

  ngOnInit() {
    // this.authService.authState.subscribe((user) => {
    //   // console.log(user);
    //   // this.user = user;
    //   // this.loggedIn = (user != null);
    //   if (user) {
    //     this.authState.dispatch(AuthActions.googleLogin({ idToken: user.idToken }));
    //   }
    // }
    // );

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.authState.dispatch(AuthActions.login({ email, password }));
    }
  }
}
