import { createAction, props } from '@ngrx/store';
import { Profile } from '../models/profile.models';

export const getProfile = createAction(
  '[Profile] Get Profile');

export const getProfileSuccess = createAction(
  '[Profile] Get Profile Success',
  props<{ profile: Profile }>()
);

export const getProfileFailure = createAction(
  '[Profile] Get Profile Failure',
  props<{ errorMessage: string }>()
);

export const updateProfile = createAction(
  '[Profile] Update Profile',
  props<{ profile: Profile }>()
);

export const updateProfileSuccess = createAction(
  '[Profile] Update Profile Success',
  props<{ profile: Profile }>()
);

export const updateProfileFailure = createAction(
  '[Profile] Update Profile Failure',
  props<{ errorMessage: string }>()
);

export const resetProfileState = createAction(
  '[Profile] Reset Profile');


export const setErrorMessage = createAction(
  '[Profile] Set Error Message',
  props<{ errorMessage: string }>()
);

export const updateProfileImage = createAction(
  '[Profile] Update Profile Image',
  props<{ imageUrl: string }>()
);

