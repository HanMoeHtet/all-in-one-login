import { AxiosResponse } from 'axios';

import {
  AuthAction,
  AuthActionType,
  LogInFormInputData,
  SignUpFormInputData,
  User,
} from './types';
import { AppThunk } from '..';
import api, { configureAuthHeader } from '../../services/api';
import { getToken, removeToken, setToken } from '../../services/jwt';
import {
  onVerificationEnded,
  onVerificationStarted,
  setVerification,
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
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch(onLoadingStarted());

      let response;
      try {
        response = await api.post('/signUpWithEmail', formInputData);
        const { status, data } = response;
        if (status === 200) {
          const { userId, email } = data.data;
          dispatch(setVerification({ userId, email }));
        }
        return resolve();
      } catch (err) {
        const { status, data } = err.response as AxiosResponse;
        if (status === 400) {
          const errors = data.errors;
          return reject({ status, errors });
        }
        if (status === 500) {
          return reject({ status });
        }
      } finally {
        dispatch(onLoadingEnded());
      }
    });

export const signUpWithPhoneNumber =
  (formInputData: SignUpFormInputData): AppThunk<Promise<void>> =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      dispatch(onLoadingStarted());

      let response;
      try {
        response = await api.post('/signUpWithPhoneNumber', formInputData);
        const { status, data } = response;
        if (status === 200) {
          const { phoneNumber, userId } = data.data;
          dispatch(setVerification({ userId, phoneNumber }));
        }
        return resolve();
      } catch (err) {
        const { status, data } = err.response as AxiosResponse;
        if (status === 400) {
          const errors = data.errors;
          return reject({ status, errors });
        }
        if (status === 500) {
          return reject({ status });
        }
      } finally {
        dispatch(onLoadingEnded());
      }
    });

export const verifyEmail =
  (token: string): AppThunk<Promise<void>> =>
  (dispatch) => {
    return new Promise(async (resolve, reject) => {
      let response;
      dispatch(onVerificationStarted());
      try {
        response = await api.post('/verifyEmail', { token });
        const { status, data } = response;
        if (status === 200) {
          const { user, token: jwtToken } = data.data;
          dispatch(onAuthSucceeded({ user, token: jwtToken }));
        }
        return resolve();
      } catch (err) {
        console.log(err);
        const response = err.response as AxiosResponse;
        const { status, data } = response;
        if (status === 400 || status === 410) {
          return reject({ status, errors: data.errors });
        }
      } finally {
        dispatch(onVerificationEnded());
      }
    });
  };

export const sendNewEmail =
  (): AppThunk<Promise<void>> => (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const userId = getState().verificationStore.userId;
      if (!userId) return reject();
      try {
        await api.post('/sendNewEmail', { userId });
        return resolve();
      } catch (err) {
        return reject();
      }
    });
  };

export const sendNewOTP =
  (): AppThunk<Promise<void>> => (dispatch, getState) => {
    return new Promise(async (resolve, reject) => {
      const userId = getState().verificationStore.userId;
      if (!userId) return reject();
      try {
        await api.post('/sendNewOTP', { userId });
        return resolve();
      } catch (err) {
        return reject();
      }
    });
  };

export const verifyPhoneNumber =
  (otp: string): AppThunk<Promise<void>> =>
  (dispatch, getState) =>
    new Promise(async (resolve, reject) => {
      let response;
      try {
        const userId = getState().verificationStore.userId;
        response = await api.post('/verifyPhoneNumber', { otp, userId });
        const { status, data } = response;
        if (status === 200) {
          const { user, token } = data.data;
          dispatch(onAuthSucceeded({ user, token }));
        }
        return resolve();
      } catch (err) {
        console.log(err);
        const response = err.response as AxiosResponse;
        const { status, data } = response;
        if (status === 400 || status === 410) {
          return reject({ status, errors: data.errors });
        }
      }
    });

export const signInWithOAuth =
  (oAuthProvider: string): AppThunk<Promise<string>> =>
  (dispatch) => {
    return new Promise(async (resolve, reject) => {
      dispatch(onLoadingStarted());
      try {
        const response = await api.post('/signInWithOAuth', { oAuthProvider });
        const { status, data } = response;
        if (status === 200) {
          const { oAuthConsentUrl } = data.data;
          return resolve(oAuthConsentUrl);
        }
      } catch (err) {
        console.log(err);
        const response = err.response as AxiosResponse;
        const { status, data } = response;
        if (status === 400) return reject({ status, errors: data.errors });
      } finally {
        dispatch(onLoadingEnded());
      }
    });
  };

export const redirectOAuth =
  (url: string): AppThunk<Promise<void>> =>
  (dispatch) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await api.get(url);
        const { status, data } = response;
        if (status === 200) {
          const { user, token } = data.data;
          dispatch(onAuthSucceeded({ user, token }));
          return resolve();
        }
      } catch (err) {
        console.log(err);
        if (!('response' in err)) return reject({ status: 500 });
        const response = err.response as AxiosResponse;
        const { status, data } = response;
        if (status === 401 || status === 403)
          return reject({ status, messages: data.messages });
        if (status === 400) return reject({ status, errors: data.errors });
        if (status === 500) return reject({ status });
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
        const { status, data } = response;
        if (status === 200) {
          const { user, token } = data.data;
          dispatch(onAuthSucceeded({ user, token }));
        }
        return resolve();
      } catch (err) {
        console.log(err);
        const response = err.response as AxiosResponse;
        const { status, data } = response;
        if (status === 404 || status === 401) {
          return reject({ status, errors: data.errors });
        }
        if (status === 500) {
          return reject({ status });
        }
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
    dispatch(setVerification({ userId: null }));
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

export const checkAuth = (): AppThunk<Promise<void>> => async (dispatch) => {
  const token = getToken();
  if (token) {
    dispatch(onLoadingStarted());
    let response;
    try {
      response = await api.post('/signInWithToken', { token });
      const { status, data } = response;
      if (status === 200) {
        const { user } = data.data;
        dispatch(setUser(user));
        dispatch(setIsAuthenticated(true));
      }
    } catch (err) {
      console.log(err);
      const response = err.response as AxiosResponse;
      const { status } = response;
      if (status === 400) {
        dispatch(logOut());
      }
    } finally {
      dispatch(onLoadingEnded());
    }
  }
};

export const logOut = (): AppThunk => (dispatch) => {
  removeToken();
  configureAuthHeader(null);
  dispatch(setIsAuthenticated(false));
  dispatch(setUser(null));
};
