export type Verification = {
  userId: string | null;
  email?: string;
  phoneNumber?: string;
};

export enum VerificationActionType {
  SET_VERIFICATION = 'SET_VERIFICATION',
}

export type VerificationAction = {
  type: VerificationActionType.SET_VERIFICATION;
  payload: Verification;
};
