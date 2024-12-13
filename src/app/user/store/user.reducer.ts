import { Action, createReducer, on } from '@ngrx/store';
import { UserActions } from '..';
import { User } from '../models/user.models';

export const userFeatureKey = 'user';

export interface UserState {
  user: User | null;
  isUserLoaded: boolean;
  errorMessage: string | null;
}

export const initialUserState: UserState = {
  user: null,
  isUserLoaded: false,
  errorMessage: null,
};

export const reducer = createReducer(
  initialUserState,
  on(UserActions.getUser, (state) => ({
    ...state,
    isUserLoaded: true,
  })),
  on(UserActions.getUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isUserLoaded: false,
  })),
  on(UserActions.getUserFailure, (state, { errorMessage }) => ({
    ...state,
    isUserLoaded: false,
    errerrorMessage: errorMessage,
  })),
  on(UserActions.addUser, (state) => ({
    ...state,
    isUserLoaded: true,
  })),
  on(UserActions.addUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isUserLoaded: false,
    errorMessage: null,
  })),
  on(UserActions.addUserFailure, (state, { errorMessage }) => ({
    ...state,
    isUserLoaded: false,
    errorMessage: errorMessage,
  })),
  on(UserActions.updateUser, (state) => ({
    ...state,
    isUserLoaded: true,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isUserLoaded: false,
    errorMessage: null,
  })),
  on(UserActions.updateUserFailure, (state, { errorMessage }) => ({
    ...state,
    isUserLoaded: false,
    errorMessage: errorMessage,
  })),
  on(UserActions.setUserErrorMessage, (state, { errorMessage }) => ({
    ...state,
    errorMessage,
  })),
  on(UserActions.clearUserError, (state) => ({
    ...state,
    errorMessage: null,
  })),
  on(UserActions.resetUserState, (state) => ({
    ...state,
    user: null,
    isUserLoaded: false,
    errorMessage: null,
  })
  ),
  on(UserActions.changePassword, (state) => ({
    ...state,
    isUserLoaded: true,
    errorMessage: null,
  })),
  on(UserActions.changePasswordSuccess, (state) => ({
    ...state,
    isUserLoaded: false,
    errorMessage: null,
  })),
  on(UserActions.changePasswordFailure, (state, { errorMessage }) => ({
    ...state,
    isUserLoaded: false,
    errorMessage: errorMessage,
  })
  )
);

export function userReducer(state: UserState | undefined, action: Action) {
  // return logger(reducer(state, action), action);
  return reducer(state, action);
}

export function logger(state: UserState | undefined, action: Action) {
  console.log('User state', state);
  console.log('User action', action);
  return state;
}
