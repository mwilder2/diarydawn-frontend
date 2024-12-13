import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.models';


/*
  * User CRUD Functions
*/

// GET
export const getUser = createAction('[User] Load User');

export const getUserSuccess = createAction(
  '[User] Load User Success',
  props<{ user: User }>()
);

export const getUserFailure = createAction(
  '[User] Load User Failure',
  props<{ errorMessage: string }>()
);

// ADD
export const addUser = createAction('[User] Add User', props<{ user: User }>());

export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: User }>()
);
export const addUserFailure = createAction(
  '[User] Add User Failure',
  props<{ errorMessage: string }>()
);

// UPDATE
export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ errorMessage: string }>()
);
/*
  * User State Store Functions
*/

export const setUserErrorMessage = createAction(
  '[User] Set User Error',
  props<{ errorMessage: string }>()
);

export const clearUserError = createAction('[User] Clear User Error');

export const resetUserState = createAction('[User] Reset User');


/*
  * User Password Reset Functions
*/

export const changePassword = createAction(
  '[User] Change Password',
  props<{ oldPassword: string; newPassword: string }>()
);

export const changePasswordSuccess = createAction(
  '[User] Change Password Success'
);

export const changePasswordFailure = createAction(
  '[User] Change Password Failure',
  props<{ errorMessage: string }>()
);