import { AuthAction, AuthActionType, AuthState } from './types';

const initialState: AuthState = {
  user: null,
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
    default:
      return state;
  }
};

export default authReducer;
