import {
  Box,
  Button,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { sendNewOTP, verifyPhoneNumber } from '../store/auth/authActions';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#8282ff',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  boxContainer: {
    backgroundColor: 'white',
    width: '50%',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const PhoneNumberVerification: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const verification = useSelector(
    (state: RootState) => state.verificationStore
  );

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  if (!('phoneNumber' in verification)) {
    history.push('/logIn');
  }

  const onFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors(['OTP is invalid.']);
      return;
    }
    try {
      await dispatch(verifyPhoneNumber(otp));
      history.push('/');
    } catch (err) {
      const { userId, otp } = err as { userId: string[]; otp: string[] };
      if (userId.length !== 0) {
        history.push('/login');
      }
      setErrors(otp);
    }
  };

  const onResendBtnClicked = async () => {
    try {
      await dispatch(sendNewOTP());
    } catch (err) {
      history.push('/logIn');
    }
  };

  return (
    <div className={classes.container}>
      <form onSubmit={onFormSubmitted} className={classes.boxContainer}>
        <Typography style={{ marginBottom: 50 }}>
          Verification code sent to {verification.phoneNumber}
        </Typography>
        <TextField
          type="text"
          label="Code"
          variant="outlined"
          value={otp}
          error={errors.length !== 0}
          helperText={errors}
          onChange={(e) => setOtp(e.target.value)}
          style={{ marginBottom: 30 }}
        />
        <Box>
          <Button
            style={{ marginRight: 30 }}
            variant="contained"
            color="primary"
            type="button"
            onClick={onResendBtnClicked}
          >
            Resend OTP
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Verify
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default PhoneNumberVerification;
