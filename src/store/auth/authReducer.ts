import { AuthAction, AuthActionType, AuthErrors, AuthState } from './types';

const initialErrorsState: AuthErrors = {
  username: [],
  email: [],
  phoneNumber: [],
  password: [],
  passwordConfirmation: [],
};

const initialState: AuthState = {
  user: null,
  errors: initialErrorsState,
  isLoading: false,
  isAuthenticated: false,
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case AuthActionType.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case AuthActionType.SET_IS_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case AuthActionType.SET_USER:
      return { ...state, user: action.payload };
    case AuthActionType.SET_ERRORS:
      return { ...state, errors: action.payload };
    default:
      return state;
  }
};

export default authReducer;
