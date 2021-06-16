import {
  VerificationAction,
  VerificationState,
  VerificationActionType,
} from './types';

const initialState: VerificationState = {
  verification: {},
  userId: null,
};

const verificationReducer = (
  state: VerificationState = initialState,
  action: VerificationAction
): VerificationState => {
  switch (action.type) {
    case VerificationActionType.SET_VERIFICATION:
      return { ...state, verification: action.payload };
    case VerificationActionType.SET_USER_ID:
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};

export default verificationReducer;
