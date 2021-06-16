export type Verification = {
  email?: string;
  phoneNumber?: string;
};

export type VerificationState = {
  userId: string | null;
  verification: Verification;
};

export enum VerificationActionType {
  SET_VERIFICATION = 'SET_VERIFICATION',
  SET_USER_ID = 'SET_USER_ID',
}

export type VerificationAction =
  | {
      type: VerificationActionType.SET_VERIFICATION;
      payload: Verification;
    }
  | { type: VerificationActionType.SET_USER_ID; payload: string | null };
