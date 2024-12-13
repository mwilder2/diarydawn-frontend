import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

/*
  * Pieces of the state
*/

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.refreshToken
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.errorMessage
);

export const selectPasswordResetError = createSelector(
  selectAuthState,
  (state: AuthState) => state.errorMessage
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsRefreshing = createSelector(
  selectAuthState,
  (state: AuthState) => state.isRefreshing
);

// In your selector file
export const getPasswordResetStatus = createSelector(
  selectAuthState,
  (state: AuthState) => state.passwordResetStatus
);
