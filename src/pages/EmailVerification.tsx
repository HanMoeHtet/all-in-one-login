import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const EmailVerification: React.FC = () => {
  const verification = useSelector(
    (state: RootState) => state.verificationStore.verification
  );

  if (!('email' in verification)) return null;

  return <div>Verification email sent to {verification.email}</div>;
};

export default EmailVerification;
