import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState, userFeatureKey } from '..';

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

/*
  * Pieces of the state
*/

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state.user
);

export const selectIsUserLoaded = createSelector(
  selectUserState,
  (state: UserState) => state.isUserLoaded
);

export const selectError = createSelector(
  selectUserState,
  (state: UserState) => state.errorMessage
);


export const selectPasswordResetError = createSelector(
  selectUserState,
  (state: UserState) => state.errorMessage
);