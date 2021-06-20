import {
  VerificationAction,
  VerificationActionType,
  Verification,
} from './types';

export const setVerification = (
  verification: Verification
): VerificationAction => {
  return {
    type: VerificationActionType.SET_VERIFICATION,
    payload: verification,
  };
};
