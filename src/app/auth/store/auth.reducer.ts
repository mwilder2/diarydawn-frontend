import { Action, createReducer, on } from '@ngrx/store';
import { AuthActions } from '..';
export const authFeatureKey = 'auth';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpireTime: Date | null;
  refreshTokenExpireTime: Date | null;
  isRefreshing: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  passwordResetStatus: 'pending' | 'success' | 'failure' | 'idle';
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  accessTokenExpireTime: null,
  refreshTokenExpireTime: null,
  isRefreshing: false,
  isLoading: false,
  errorMessage: null,
  passwordResetStatus: 'idle',
};


export const reducer = createReducer(
  initialAuthState,
  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { errorMessage }) => ({
    ...state,
    isLoading: false,
    errorMessage: errorMessage,
  })),
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    isRefreshing: true,
  })),
  on(AuthActions.loginSuccess, (state, { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime }) => ({
    ...state,
    isAuthenticated: true,
    accessToken: accessToken,
    refreshToken: refreshToken,
    accessTokenExpireTime: accessTokenExpireTime,
    refreshTokenExpireTime: refreshTokenExpireTime,
    isLoading: false,
    isRefreshing: false,
    errorMessage: null,
  })),
  on(AuthActions.loginFailure, (state, { errorMessage }) => ({
    ...state,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    errorMessage: errorMessage,
  })),
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isRefreshing: true,
    isLoading: true,
  })),
  on(
    AuthActions.refreshTokenSuccess,
    (state, { accessToken, refreshToken, accessTokenExpireTime, refreshTokenExpireTime }) => ({
      ...state,
      isAuthenticated: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpireTime: accessTokenExpireTime,
      refreshTokenExpireTime: refreshTokenExpireTime,
      isRefreshing: false,
      isLoading: false,
      errorMessage: null,
    })
  ),
  on(AuthActions.refreshTokenFailure, (state, { errorMessage }) => ({
    ...state,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    errorMessage: errorMessage,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    isAuthenticated: false,
    isLoading: false,
    errorMessage: null,
  })),
  on(AuthActions.logoutFailure, (state, { errorMessage }) => ({
    ...state,
    errorMessage: errorMessage,
    isLoading: false,
  })),
  on(AuthActions.setAuthError, (state, { error }) => ({
    ...state,
    errorMessage: error,
  })),
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    errorMessage: null,
  })),
  on(AuthActions.resetAuthState, (state) => ({
    ...state,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    accessTokenExpireTime: null,
    refreshTokenExpireTime: null,
    isRefreshing: false,
    isLoading: false,
    errorMessage: null,
  })),
  on(AuthActions.requestPasswordReset, state => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.passwordResetSuccess, state => ({
    ...state,
    isLoading: false,
    passwordResetStatus: 'success' as const,
  })),
  on(AuthActions.passwordResetFailure, state => ({
    ...state,
    isLoading: false,
    passwordResetStatus: 'failure' as const,
  })),
  on(AuthActions.submitPasswordResetCode, (state) => ({
    ...state,
    isLoading: true,
    errorMessage: null,
  })),
  on(AuthActions.setIsAuthenticated, (state, { isAuthenticated }) => ({
    ...state,
    isAuthenticated: isAuthenticated,
  })),
  on(AuthActions.sendEmail, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.sendEmailSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(AuthActions.sendEmailFailure, (state, { errorMessage }) => ({
    ...state,
    isLoading: false,
    errorMessage: errorMessage,
  })),
  on(AuthActions.googleLogin, (state) => ({
    ...state,
    isLoading: true,
  })),
);

export function authReducer(state: AuthState | undefined, action: Action) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: AuthState | undefined, action: Action) {
  console.log('Auth state', state);
  console.log('Auth action', action);
  return state;
}
