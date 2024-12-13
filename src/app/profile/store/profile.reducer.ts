import { createReducer, on, Action } from "@ngrx/store";
import { ProfileActions } from "..";
import { Profile } from "../models/profile.models";

export const profileFeatureKey = 'profile';

export interface ProfileState {
  profile: Profile | null;
  isProfileLoaded: boolean;
  errorMessage: string | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  isProfileLoaded: false,
  errorMessage: null,
};

export const reducer = createReducer(
  initialProfileState,
  on(ProfileActions.getProfile, (state) => ({
    ...state,
    isProfileLoaded: true,
  })),
  on(ProfileActions.getProfileSuccess, (state, { profile }) => ({
    ...state,
    profile: profile,
    isProfileLoaded: false,
  })),
  on(ProfileActions.getProfileFailure, (state, { errorMessage }) => ({
    ...state,
    isProfileLoaded: false,
    errerrorMessage: errorMessage,
  })),
  on(ProfileActions.updateProfile, (state) => ({
    ...state,
    isProfileLoaded: true,
  })),
  on(ProfileActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile: profile,
    isProfileLoaded: false,
    errorMessage: null,
  })),
  on(ProfileActions.updateProfileFailure, (state, { errorMessage }) => ({
    ...state,
    isProfileLoaded: false,
    errorMessage: errorMessage,
  })),
  on(ProfileActions.resetProfileState, (state) => ({
    ...state,
    profile: null,
    isProfileLoaded: false,
    errorMessage: null,
  })),
  on(ProfileActions.setErrorMessage, (state, { errorMessage }) => ({
    ...state,
    errorMessage: errorMessage,
  })),
  on(ProfileActions.updateProfileImage, (state, { imageUrl }) => ({
    ...state,
    profile: {
      ...state.profile,
      pictureUrl: imageUrl,
      id: state.profile?.id || 0, // Set id to 0 if it is undefined
    },
  }))
);

export function profileReducer(
  state: ProfileState | undefined,
  action: Action
) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: ProfileState | undefined, action: Action) {
  console.log('Profile state', state);
  console.log('Profile action', action);
  return state;
}
