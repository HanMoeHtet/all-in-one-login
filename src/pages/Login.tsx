import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link, Typography, Divider } from '@material-ui/core';
import { Box } from '@material-ui/core';
import LogInForm from '../components/LogInForm';
import SignUpForm from '../components/SignUpForm';
import OAuthForm from '../components/OAuthForm';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#8282ff',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  boxContainer: {
    width: '1000px',
    minHeight: '500px',
    backgroundColor: 'white',
    borderRadius: '21px',
    padding: '20px',
    flexDirection: 'row',
  },
});

const Login: React.FC = () => {
  const classes = useStyles();

  const [isLoggingIn, setIsLoggingIn] = useState(true);

  return (
    <Box className={classes.container}>
      <Grid container className={classes.boxContainer}>
        <Grid item md={6}>
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            padding="0 80px"
            justifyContent="center"
          >
            {isLoggingIn ? <LogInForm /> : <SignUpForm />}
            <Box display="flex" justifyContent="flex-end">
              <Typography>
                <Link
                  style={{ marginRight: 10 }}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoggingIn(!isLoggingIn);
                  }}
                >
                  {isLoggingIn
                    ? 'Create an account'
                    : 'Already have an account?'}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          style={{ height: 'inherit', marginRight: -1 }}
        />
        <Grid item md={6}>
          <Box
            display="flex"
            padding="0 110px"
            height="100%"
            flexDirection="column"
            justifyContent="center"
          >
            <Typography
              variant="h5"
              color="primary"
              align="center"
              style={{ marginBottom: 30 }}
            >
              Continue with
            </Typography>
            <OAuthForm />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
