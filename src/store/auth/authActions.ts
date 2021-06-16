import {
  AuthAction,
  AuthActionType,
  AuthErrors,
  SignUpFormInputData,
  User,
} from './types';
import { AppThunk } from '..';
import api, { configureAuthHeader } from '../../services/api';
import { removeToken, setToken } from '../../services/jwt';
import { AxiosResponse } from 'axios';

export const onsLoadingStarted = (): AuthAction => {
  return {
    type: AuthActionType.SET_IS_LOADING,
    payload: true,
  };
};

export const onLoadingEnded = (): AuthAction => {
  return {
    type: AuthActionType.SET_IS_LOADING,
    payload: false,
  };
};

export const signUpWithEmail =
  (formInputData: SignUpFormInputData): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(onsLoadingStarted());

    let response;
    try {
      response = await api.post('/signUpWithEmail', formInputData);
      const { status, data } = response;
      if (status === 200) {
        const { user, token } = data.data;
        dispatch(onAuthSucceeded({ user, token }));
      }
    } catch (err) {
      const { status, data } = err.response as AxiosResponse;
      if (status === 400) {
        const errors = data.errors;
        dispatch(setErrors(errors));
      }
    } finally {
      dispatch(onLoadingEnded());
    }
  };

export const signUpWithPhoneNumber =
  (formInputData: SignUpFormInputData): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(onsLoadingStarted());

    let response;
    try {
      response = await api.post('/signUpWithPhoneNumber', formInputData);
      const { status, data } = response;
      if (status === 200) {
        const { user, token } = data.data;
        dispatch(onAuthSucceeded({ user, token }));
      }
    } catch (err) {
      const { status, data } = err.response as AxiosResponse;
      if (status === 400) {
        const errors = data.errors;
        dispatch(setErrors(errors));
      }
    } finally {
      dispatch(onLoadingEnded());
    }
  };

export const onAuthSucceeded =
  ({ user, token }: { user: User; token: string }): AppThunk =>
  (dispatch) => {
    setToken(token);
    configureAuthHeader(token);
    dispatch(setIsAuthenticated(true));
    dispatch(setUser(user));
  };

export const setIsAuthenticated = (isAuthenticated: boolean): AuthAction => {
  return {
    type: AuthActionType.SET_IS_AUTHENTICATED,
    payload: true,
  };
};

export const setUser = (user: User | null): AuthAction => {
  return {
    type: AuthActionType.SET_USER,
    payload: user,
  };
};

export const setErrors = (errors: AuthErrors): AuthAction => {
  return {
    type: AuthActionType.SET_ERRORS,
    payload: errors,
  };
};

export const setError =
  (error: Partial<AuthErrors>): AppThunk<void> =>
  async (dispatch, getState) => {
    const errors = getState().authStore.errors;
    dispatch(setErrors({ ...errors, ...error }));
  };

export const checkAuth = () => {};

export const logout = (): AppThunk => (dispatch) => {
  removeToken();
  configureAuthHeader('');
  dispatch(setIsAuthenticated(false));
  dispatch(setUser(null));
};
