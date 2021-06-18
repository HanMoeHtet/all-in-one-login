import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { verifyEmail } from '../store/auth/authActions';

const EmailVerification: React.FC = () => {
  const verification = useSelector(
    (state: RootState) => state.verificationStore.verification
  );

  const query = new URLSearchParams(useLocation().search);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  (async function () {
    const token = query.get('token');
    if (token) {
      try {
        await dispatch(verifyEmail(token));
        history.push('/');
      } catch (err) {}
    }
  })();
  console.log(verification);
  if (!('email' in verification)) return null;

  return <div>Verification email sent to {verification.email}</div>;
};

export default EmailVerification;
