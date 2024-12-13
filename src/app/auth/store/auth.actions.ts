import { createAction, props } from '@ngrx/store';
import { sendEmailDto } from '../../auth/models/email.mode';

/*
  * Auth Security Functions
*/

// REGISTER
export const register = createAction(
  '[Auth] register',
  props<{ email: string; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] register Success'
);

export const registerFailure = createAction(
  '[Auth] register Failure',
  props<{ errorMessage: string }>()
);

// LOGIN
export const login = createAction(
  '[Auth] login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] login Success',
  props<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpireTime: Date;
    refreshTokenExpireTime: Date;
  }>()
);

export const loginFailure = createAction(
  '[Auth] login Failure',
  props<{ errorMessage: string }>()
);

// Google Login
export const googleLogin = createAction(
  '[Auth] Google Login',
  props<{ idToken: string }>()
);

// LOGOUT
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction(
  '[Auth] Logout SuccessMessage'
);

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ errorMessage: string }>()
);


export const refreshToken = createAction(
  '[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpireTime: Date;
    refreshTokenExpireTime: Date;
  }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ errorMessage: string }>()
);


/*
  * Auth Password Reset
*/
export const requestPasswordReset = createAction(
  '[Auth] Request Password Reset',
  props<{ email: string }>()
);

export const requestPasswordResetSuccess = createAction(
  '[Auth] Request Password Reset Success'
);

export const requestPasswordResetFailure = createAction(
  '[Auth] Request Password Reset Failure',
  props<{ errorMessage: string }>()
);

export const submitPasswordResetCode = createAction(
  '[Auth] Submit Password Reset Code',
  props<{ confirmationCode: string; newPassword: string }>()
);

export const passwordResetSuccess = createAction(
  '[Auth] Password Reset Success'
);

export const passwordResetFailure = createAction(
  '[Auth] Password Reset Failure',
  props<{ errorMessage: string }>()
);


/*
  * Auth State Store Functions
*/

export const setIsAuthenticated = createAction(
  '[Auth] Set Authenticated',
  props<{ isAuthenticated: boolean }>()
);

export const setAuthError = createAction(
  '[Auth] Set Auth Error',
  props<{ error: string }>()
);

export const clearAuthError = createAction('[Auth] Clear Auth Error');

export const resetAuthState = createAction('[Auth] Reset Auth');

export const sendEmail = createAction(
  '[Auth] Send Email',
  props<{ contactForm: sendEmailDto }>()
);

export const sendEmailSuccess = createAction(
  '[Auth] Send Email Success'
);

export const sendEmailFailure = createAction(
  '[Auth] Send Email Failure',
  props<{ errorMessage: string }>()
);