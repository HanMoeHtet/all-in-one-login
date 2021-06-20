import { Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { sendNewEmail, verifyEmail } from '../store/auth/authActions';
import { makeStyles } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { useEffect } from 'react';

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

const EmailVerification: React.FC = () => {
  const classes = useStyles();

  const verification = useSelector(
    (state: RootState) => state.verificationStore
  );

  const { search } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  useEffect(() => {
    (async function () {
      const query = new URLSearchParams(search);
      const token = query.get('token');
      if (token) {
        try {
          await dispatch(verifyEmail(token));
          return history.push('/');
        } catch (err) {
          return history.push('/logIn');
        }
      }
    })();
  }, [dispatch, history, search]);

  if (!('email' in verification)) {
    history.push('/login');
  }

  const onResendBtnClicked = async () => {
    try {
      await dispatch(sendNewEmail());
    } catch (err) {
      history.push('/logIn');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.boxContainer}>
        <Typography style={{ marginBottom: '30px' }}>
          Verification email sent to {verification.email}
        </Typography>
        <Button
          onClick={onResendBtnClicked}
          variant="contained"
          color="primary"
        >
          Resend email
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
