import React, { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import api from '../services/api';
import _ from 'lodash';
import {
  validateEmail as validateEmailHelper,
  validateUsername as validateUsernameHelper,
  validatePassword as validatePasswordHelper,
  validatePasswordConfirmation as validatePasswordConfirmationHelper,
} from '../utils/userValidation';

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

interface ErrorState {
  username?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

const Login: React.FC = () => {
  const classes = useStyles();

  const [formInputData, setFormInputData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<ErrorState>({});

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const validateUsernameDebounced = useMemo(
    () =>
      _.debounce((username: string) => {
        if (username.length === 0) return;

        const [isValid, message] = validateUsernameHelper(username);

        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            username: message,
          }));
          return;
        }

        api
          .post('/validation/validateUsername', { username })
          .then(() => {
            setErrors((errors) => {
              const { username, ...rest } = errors;
              return rest;
            });
          })
          .catch((err) => {
            const { message } = err.response.data;
            setErrors((errors) => ({
              ...errors,
              username: message,
            }));
          });
      }, 500),
    []
  );

  const validateEmailDebounced = useMemo(
    () =>
      _.debounce((email: string) => {
        if (email.length === 0) {
          return;
        }

        const [isValid, message] = validateEmailHelper(email);

        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            email: message,
          }));
          return;
        }

        const url = '/validation/validateEmail';
        api
          .post(url, { email })
          .then(() => {
            setErrors((errors) => {
              const { email, ...rest } = errors;
              return rest;
            });
          })
          .catch((err) => {
            const { message } = err.response.data;
            setErrors((errors) => ({
              ...errors,
              email: message,
            }));
          });
      }, 500),
    []
  );

  const validatePasswordDebounced = useMemo(
    () =>
      _.debounce((password: string) => {
        if (password.length === 0) return;
        const [isValid, message] = validatePasswordHelper(password);
        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            password: message,
          }));
          return;
        }

        setErrors((errors) => {
          const { password, ...rest } = errors;
          return rest;
        });
      }, 500),
    []
  );

  const validatePasswordConfirmationDebounced = useMemo(
    () =>
      _.debounce((passwordConfirmation: string) => {
        console.log(passwordConfirmation.length, formInputData.password.length);
        if (
          passwordConfirmation.length === 0 ||
          formInputData.password.length === 0
        )
          return;

        const [isValid, message] = validatePasswordConfirmationHelper(
          passwordConfirmation,
          formInputData.password
        );
        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            password_confirmation: message,
          }));
          return;
        }

        setErrors((errors) => {
          const { password_confirmation, ...rest } = errors;
          return rest;
        });
      }, 500),
    [formInputData.password]
  );

  const onFormInputChanged = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;

    setFormInputData({ ...formInputData, [target.name]: target.value });
    switch (target.name) {
      case 'username':
        validateUsernameDebounced(target.value);
        break;
      case 'email':
        validateEmailDebounced(target.value);
        break;
      case 'password':
        validatePasswordDebounced(target.value);
        if (formInputData.password_confirmation.length > 0) {
          validatePasswordConfirmationDebounced(
            formInputData.password_confirmation
          );
        }
        break;
      case 'password_confirmation':
        validatePasswordConfirmationDebounced(target.value);
        break;
      default:
    }
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
              error={Boolean(errors.username)}
              helperText={errors.username}
              variant="outlined"
              fullWidth
              required
              style={{ marginBottom: '10px' }}
              onChange={onFormInputChanged}
            />

            <TextField
              label="Email"
              placeholder="username@example.com"
              name="email"
              variant="outlined"
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
              required
              style={{ marginBottom: '10px' }}
              onChange={onFormInputChanged}
            />
            <TextField
              type={isShowingPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              variant="outlined"
              error={Boolean(errors.password)}
              helperText={errors.password}
              fullWidth
              required
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
              required
              error={Boolean(errors.password_confirmation)}
              helperText={errors.password_confirmation}
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
