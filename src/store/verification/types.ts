export type Verification = {
  userId: string | null;
  email?: string;
  phoneNumber?: string;
  isLoading?: boolean;
};

export enum VerificationActionType {
  SET_VERIFICATION = 'SET_VERIFICATION',
  SET_IS_LOADING = 'SET_IS_VERIFYING',
}

export type VerificationAction =
  | {
      type: VerificationActionType.SET_VERIFICATION;
      payload: Verification;
    }
  | {
      type: VerificationActionType.SET_IS_LOADING;
      payload: boolean;
    };
