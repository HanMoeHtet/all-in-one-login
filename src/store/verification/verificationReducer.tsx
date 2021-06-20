import {
  VerificationAction,
  Verification as VerificationState,
  VerificationActionType,
} from './types';

const initialState: VerificationState = {
  userId: null,
};

const verificationReducer = (
  state: VerificationState = initialState,
  action: VerificationAction
): VerificationState => {
  switch (action.type) {
    case VerificationActionType.SET_VERIFICATION:
      return action.payload;
    default:
      return state;
  }
};

export default verificationReducer;
