export type SignUpFormInputData = {
  username: string;
  password: string;
  passwordConfirmation: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
};

export type LogInFormInputData = {
  username: string;
  password: string;
};

export type User = {
  userId: string;
  username: string;
  avatar: string;
  email?: string;
  phoneNumber?: string;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export enum AuthActionType {
  SET_IS_LOADING = 'SET_IS_LOADING',
  SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED',
  SET_USER = 'SET_USER',
}

export type AuthAction =
  | {
      type: AuthActionType.SET_IS_LOADING;
      payload: boolean;
    }
  | {
      type: AuthActionType.SET_IS_AUTHENTICATED;
      payload: boolean;
    }
  | {
      type: AuthActionType.SET_USER;
      payload: User | null;
    };
