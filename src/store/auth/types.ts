export type SignUpFormInputData = {
  username: string;
  password: string;
  passwordConfirmation: string;
} & (
  | { email: string }
  | {
      phoneNumber: string;
    }
);

export type User = {
  userId: string;
  username: string;
  avatar: string;
};

export type AuthErrors = {
  username: string[];
  email: string[];
  phoneNumber: string[];
  password: string[];
  passwordConfirmation: string[];
};

export type AuthState = {
  user: User | null;
  errors: AuthErrors;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export enum AuthActionType {
  SET_IS_LOADING = 'SET_IS_LOADING',
  SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED',
  SET_USER = 'SET_USER',
  SET_ERRORS = 'SET_ERRORS',
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
    }
  | {
      type: AuthActionType.SET_ERRORS;
      payload: AuthErrors;
    };
