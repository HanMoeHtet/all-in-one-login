import {
  Verification,
  VerificationAction,
  VerificationActionType,
} from './types';

export const setVerification = (
  verification: Verification
): VerificationAction => {
  return {
    type: VerificationActionType.SET_VERIFICATION,
    payload: verification,
  };
};

export const setVerificationUserId = (userId: string | null) => {
  return {
    type: VerificationActionType.SET_USER_ID,
    payload: userId,
  };
};
