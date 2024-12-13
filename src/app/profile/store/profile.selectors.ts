import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProfileState } from '..';
import { profileFeatureKey } from "./profile.reducer";


export const selectProfileState =
  createFeatureSelector<ProfileState>(profileFeatureKey);

/*
 * Pieces of the state
 */

export const selectProfile = createSelector(
  selectProfileState,
  (state: ProfileState) => state.profile
);

export const selectIsProfileLoaded = createSelector(
  selectProfileState,
  (state: ProfileState) => state.isProfileLoaded
);

export const selectError = createSelector(
  selectProfileState,
  (state: ProfileState) => state.errorMessage
);
