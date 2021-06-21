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

export const setLoading = (isLoading: boolean): VerificationAction => {
  return {
    type: VerificationActionType.SET_IS_LOADING,
    payload: isLoading,
  };
};

export const onVerificationStarted = () => setLoading(true);
export const onVerificationEnded = () => setLoading(false);
