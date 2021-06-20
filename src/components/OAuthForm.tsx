import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import FacebookIcon from './FacebookIcon';
import GithubIcon from './GithubIcon';
import GoogleIcon from './GoogleIcon';
import oAuthProviders from '../utils/oAuthProviders.json';
import { useDispatch } from 'react-redux';
import { signInWithOAuth, checkAuth } from '../store/auth/authActions';
import { AppDispatch } from '../store';

const getOAuthProviderIcon = (providerName: string) => {
  switch (providerName) {
    case 'Google':
      return <GoogleIcon style={{ fontSize: '30px' }} />;
    case 'Facebook':
      return <FacebookIcon style={{ fontSize: '30px' }} />;
    case 'Github':
      return <GithubIcon style={{ fontSize: '30px' }} />;
    default:
      return null;
  }
};

const useStyles = makeStyles({
  buttonLabel: {
    display: 'flex',
    justifyContent: 'flex-start',
  },

  buttonText: {
    flexGrow: 1,
  },
});

const OAuthForm: React.FC = () => {
  const classes = useStyles();

  const dispatch = useDispatch<AppDispatch>();

  const onOAuthSignInBtnClicked = async (oAuthProvider: string) => {
    try {
      const oAuthConsentUrl = await dispatch(signInWithOAuth(oAuthProvider));
      const popUpWindow = window.open(oAuthConsentUrl, '_blank', 'location=0');
      const interval = setInterval(() => {
        if (popUpWindow && popUpWindow.closed) {
          clearInterval(interval);
          dispatch(checkAuth());
        }
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {oAuthProviders.map((provider, index) => (
        <Button
          classes={{
            label: classes.buttonLabel,
          }}
          key={index}
          style={{
            backgroundColor: provider.backgroundColor,
            marginBottom: 15,
          }}
          variant="contained"
          onClick={() => onOAuthSignInBtnClicked(provider.name)}
          type="button"
          size="large"
          startIcon={getOAuthProviderIcon(provider.name)}
        >
          <Typography
            variant="h6"
            className={classes.buttonText}
            style={{ color: provider.color, textTransform: 'none' }}
          >
            {provider.name}
          </Typography>
        </Button>
      ))}
    </>
  );
};

export default OAuthForm;
