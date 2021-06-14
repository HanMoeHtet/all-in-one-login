import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import api from '../services/api';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#8282ff',
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  form__container: {
    width: '1000px',
    height: '500px',
    backgroundColor: 'white',
    borderRadius: '21px',
    padding: '20px',
  },

  email__form: {
    display: 'flex',
    alignItems: 'center',
    width: 300,
  },

  oauth__form: {
    width: 300,
    backgroundColor: 'blue',
  },
});

const Login: React.FC = () => {
  const classes = useStyles();

  const [formInputData, setFormInputData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const onFormInputChanged = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.name === 'username') {
      api
        .post('/validation/validateUsername', { username: target.value })
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setFormInputData({ ...formInputData, [target.name]: target.value });
  };

  const onEmailFormSubmitted = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formInputData);
  };

  return (
    <div className={classes.container}>
      <Grid
        container
        className={classes.form__container}
        justify="space-around"
      >
        <Grid item className={classes.email__form}>
          <form name="emailForm" onSubmit={onEmailFormSubmitted}>
            <TextField
              label="Username"
              placeholder="JohnDoe123"
              name="username"
              helperText="Username already exists."
              variant="outlined"
              fullWidth
              style={{ marginBottom: '10px' }}
              onChange={onFormInputChanged}
            />

            <TextField
              label="Email"
              placeholder="username@example.com"
              name="email"
              variant="outlined"
              helperText="Username already exists."
              fullWidth
              style={{ marginBottom: '10px' }}
              onChange={onFormInputChanged}
            />
            <TextField
              type={isShowingPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              variant="outlined"
              helperText="Username already exists."
              fullWidth
              style={{ marginBottom: '10px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => {
                        setIsShowingPassword(!isShowingPassword);
                      }}
                      onMouseDown={(e: React.MouseEvent) => {
                        e.preventDefault();
                      }}
                    >
                      {isShowingPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={onFormInputChanged}
            />
            <TextField
              type={isShowingPassword ? 'text' : 'password'}
              label="Confirm Password"
              name="password_confirmation"
              variant="outlined"
              fullWidth
              helperText="Username already exists."
              style={{ marginBottom: '10px' }}
              onChange={onFormInputChanged}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              style={{ marginTop: '30px' }}
            >
              Sign up
            </Button>
          </form>
        </Grid>
        <Grid item className={classes.oauth__form}>
          Oauth form
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
