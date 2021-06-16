import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { verifyPhoneNumber } from '../store/auth/authActions';

const PhoneNumberVerification: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const verification = useSelector(
    (state: RootState) => state.verificationStore.verification
  );

  const [otp, setOtp] = useState('');

  if (!('phoneNumber' in verification)) return null;

  const onFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(verifyPhoneNumber(otp));
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={onFormSubmitted}>
      <label htmlFor="otp">Enter code sent to {verification.phoneNumber}</label>
      <input
        id="otp"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PhoneNumberVerification;
