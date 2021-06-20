import {
  combineReducers,
  createStore,
  applyMiddleware,
  AnyAction,
} from 'redux';
import reduxThunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import authReducer from './auth/authReducer';
import { AuthAction } from './auth/types';
import { VerificationAction } from './verification/types';
import verificationReducer from './verification/verificationReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  authStore: authReducer,
  verificationStore: verificationReducer,
});

const composeEnhancers = composeWithDevTools({
  trace: true,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(reduxThunk))
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = ThunkDispatch<
  ReturnType<typeof rootReducer>,
  unknown,
  AuthAction | VerificationAction
>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default store;
