import {
  AuthAction,
  AuthActionType,
  AuthErrors,
  LogInFormInputData,
  SignUpFormInputData,
  User,
} from './types';
import { AppThunk } from '..';
import api, { configureAuthHeader } from '../../services/api';
import { getToken, removeToken, setToken } from '../../services/jwt';
import { AxiosResponse } from 'axios';
import {
  setVerification,
  setVerificationUserId,
} from '../verification/verificationActions';

export const onLoadingStarted = (): AuthAction => {
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
    dispatch(onLoadingStarted());

    let response;
    try {
      response = await api.post('/signUpWithEmail', formInputData);
      const { status, data } = response;
      if (status === 200) {
        const { email } = data.data;
        dispatch(setVerification({ email }));
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

export const verifyEmail =
  (token: string): AppThunk<Promise<void>> =>
  (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        const userId = getState().verificationStore.userId;
        response = await api.post('/verifyEmail', { token, userId });
        const { user, token: jwtToken } = response.data.data;
        console.log('hello from auth succeeded');
        dispatch(onAuthSucceeded({ user, token: jwtToken }));
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });
  };

export const signUpWithPhoneNumber =
  (formInputData: SignUpFormInputData): AppThunk<Promise<void>> =>
  async (dispatch) => {
    dispatch(onLoadingStarted());

    let response;
    try {
      response = await api.post('/signUpWithPhoneNumber', formInputData);
      const { status, data } = response;
      if (status === 200) {
        const { phoneNumber, userId } = data.data;
        dispatch(setVerificationUserId(userId));
        dispatch(setVerification({ phoneNumber }));
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

export const verifyPhoneNumber =
  (otp: string): AppThunk<Promise<void>> =>
  (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      let response;
      try {
        const userId = getState().verificationStore.userId;
        response = await api.post('/verifyPhoneNumber', { otp, userId });
        const { user, token } = response.data.data;
        dispatch(onAuthSucceeded({ user, token }));
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      }
    });

export const logIn =
  (logInFormInputData: LogInFormInputData): AppThunk<Promise<void>> =>
  (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch(onLoadingStarted());
      let response;
      try {
        response = await api.post('/logIn', logInFormInputData);
        const { user, token } = response.data.data;
        dispatch(onAuthSucceeded({ user, token }));
        resolve();
      } catch (err) {
        console.log(err);
        reject();
      } finally {
        dispatch(onLoadingEnded());
      }
    });
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
    payload: isAuthenticated,
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

export const checkAuth = (): AppThunk => async (dispatch) => {
  dispatch(onLoadingStarted());
  const token = getToken();
  if (token) {
    let response;
    try {
      response = await api.post('/signInWithToken', { token });
      const { user } = response.data.data;
      dispatch(setUser(user));
      dispatch(setIsAuthenticated(true));
    } catch (err) {
      console.log(err);
    }
  }
  dispatch(onLoadingEnded());
};

export const logout = (): AppThunk => (dispatch) => {
  removeToken();
  configureAuthHeader('');
  dispatch(setIsAuthenticated(false));
  dispatch(setUser(null));
};
