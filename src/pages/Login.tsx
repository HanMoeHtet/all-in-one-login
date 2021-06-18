import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  createStyles,
  Link,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import api from '../services/api';
import _ from 'lodash';
import {
  validateEmail as validateEmailHelper,
  validateUsername as validateUsernameHelper,
  validatePassword as validatePasswordHelper,
  validatePasswordConfirmation as validatePasswordConfirmationHelper,
} from '../utils/userValidation';
import {
  logIn,
  setError,
  signUpWithEmail,
  signUpWithPhoneNumber,
} from '../store/auth/authActions';
import { LogInFormInputData, SignUpFormInputData } from '../store/auth/types';
import { AppDispatch, RootState } from '../store';
import { useHistory } from 'react-router-dom';
import countryCodes from '../utils/countryCodes.json';

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

function countryToFlag(isoCode: string) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

const Login: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const errors = useSelector((state: RootState) => state.authStore.errors);
  const isLoading = useSelector(
    (state: RootState) => state.authStore.isLoading
  );

  const [isShowingPassword, setIsShowingPassword] = useState(false);
  const [isUsingEmail, setIsUsingEmail] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const [signUpFormInputData, setSignUpFormInputData] =
    useState<SignUpFormInputData>({
      username: '',
      email: '',
      phoneNumber: '',
      countryCode: '',
      password: '',
      passwordConfirmation: '',
    });

  const [logInFormInputData, setLoginFormInputData] =
    useState<LogInFormInputData>({
      username: '',
      password: '',
    });

  const validateUsernameDebounced = useMemo(
    () =>
      _.debounce((username: string) => {
        if (username.length === 0) return;

        const [isValid, messages] = validateUsernameHelper(username);

        if (!isValid) {
          dispatch(
            setError({
              username: messages,
            })
          );
          return;
        }

        api
          .post('/validation/validateUsername', { username })
          .then(() => {
            dispatch(setError({ username: [] }));
          })
          .catch((err) => {
            const { errors } = err.response.data;
            dispatch(
              setError({
                username: errors.username,
              })
            );
          });
      }, 500),
    [dispatch]
  );

  const validateEmailDebounced = useMemo(
    () =>
      _.debounce((email: string) => {
        if (email.length === 0) {
          return;
        }

        const [isValid, messages] = validateEmailHelper(email);

        if (!isValid) {
          dispatch(
            setError({
              email: messages,
            })
          );
          return;
        }

        const url = '/validation/validateEmail';
        api
          .post(url, { email })
          .then(() => {
            dispatch(setError({ email: [] }));
          })
          .catch((err) => {
            const { errors } = err.response.data;
            dispatch(
              setError({
                email: errors.email,
              })
            );
          });
      }, 500),
    [dispatch]
  );

  const validatePasswordDebounced = useMemo(
    () =>
      _.debounce((password: string) => {
        if (password.length === 0) return;
        const [isValid, messages] = validatePasswordHelper(password);
        if (!isValid) {
          dispatch(
            setError({
              password: messages,
            })
          );
          return;
        }

        dispatch(setError({ password: [] }));
      }, 500),
    [dispatch]
  );

  const validatePasswordConfirmationDebounced = useMemo(
    () =>
      _.debounce((passwordConfirmation: string) => {
        if (
          passwordConfirmation.length === 0 ||
          signUpFormInputData.password.length === 0
        )
          return;

        const [isValid, messages] = validatePasswordConfirmationHelper(
          passwordConfirmation,
          signUpFormInputData.password
        );
        if (!isValid) {
          dispatch(
            setError({
              passwordConfirmation: messages,
            })
          );
          return;
        }
        dispatch(setError({ passwordConfirmation: [] }));
      }, 500),
    [signUpFormInputData.password, dispatch]
  );

  const onFormInputChanged = (e: React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    setSignUpFormInputData({
      ...signUpFormInputData,
      [target.name]: target.value,
    });
    switch (target.name) {
      case 'username':
        validateUsernameDebounced(target.value);
        break;
      case 'email':
        validateEmailDebounced(target.value);
        break;
      case 'password':
        validatePasswordDebounced(target.value);
        if (signUpFormInputData.passwordConfirmation.length > 0) {
          validatePasswordConfirmationDebounced(
            signUpFormInputData.passwordConfirmation
          );
        }
        break;
      case 'passwordConfirmation':
        validatePasswordConfirmationDebounced(target.value);
        break;
      default:
    }
  };

  const onCountryInputChanged = (
    e: React.ChangeEvent<{}>,
    value: {
      name: string;
      dial_code: string;
      code: string;
    } | null
  ) => {
    if (value === null) return;
    setSignUpFormInputData({
      ...signUpFormInputData,
      countryCode: value.dial_code,
    });
  };

  const isValidFormInput = () => {
    for (let error of Object.values(errors)) {
      if (error.length > 0) return false;
    }
    for (let input of Object.values(signUpFormInputData)) {
      if (typeof input === 'string' && input.length === 0) return false;
    }
    return true;
  };

  const onSignUpFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, passwordConfirmation } = signUpFormInputData;

    if (username.length === 0) {
      dispatch(
        setError({
          username: ['Username is required.'],
        })
      );
      return;
    }

    if (isUsingEmail) {
      const { email } = signUpFormInputData;
      if (email === undefined || email.length === 0) {
        dispatch(
          setError({
            email: ['Email is required.'],
          })
        );
        return;
      }
    } else {
      const { phoneNumber } = signUpFormInputData;
      if (phoneNumber === undefined || phoneNumber.length === 0) {
        dispatch(
          setError({
            phoneNumber: ['PhoneNumber is required.'],
          })
        );
        return;
      }
    }

    if (password.length === 0) {
      dispatch(
        setError({
          password: ['Password is required.'],
        })
      );
      return;
    }

    if (passwordConfirmation.length === 0) {
      dispatch(
        setError({
          passwordConfirmation: ['Password confirmation is required.'],
        })
      );
      return;
    }

    try {
      if (isUsingEmail) {
        await dispatch(signUpWithEmail(signUpFormInputData));
        history.push('/verifyEmail');
      } else {
        await dispatch(signUpWithPhoneNumber(signUpFormInputData));
        history.push('/verifyPhoneNumber');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onLogInFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(logIn(logInFormInputData));
  };

  return (
    <div className={classes.container}>
      <Grid
        container
        className={classes.form__container}
        justify="space-around"
      >
        <Grid item className={classes.email__form}>
          {isLoggingIn ? (
            <form name="LoginForm" onSubmit={onLogInFormSubmitted}>
              <TextField
                label="Username"
                placeholder="JohnDoe123"
                name="username"
                autoComplete="username"
                value={logInFormInputData.username}
                disabled={isLoading}
                variant="outlined"
                fullWidth
                required
                style={{ marginBottom: '10px' }}
                onChange={(e) =>
                  setLoginFormInputData({
                    ...logInFormInputData,
                    username: e.target.value,
                  })
                }
              />
              <TextField
                type={isShowingPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                autoComplete="current-password password"
                variant="outlined"
                value={logInFormInputData.password}
                disabled={isLoading}
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
                onChange={(e) =>
                  setLoginFormInputData({
                    ...logInFormInputData,
                    password: e.target.value,
                  })
                }
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                style={{ marginTop: '30px', marginBottom: 20 }}
                disabled={!isValidFormInput() && isLoading}
              >
                Log in
              </Button>
              <Grid container justify="flex-end">
                <Typography>
                  <Link
                    style={{ marginRight: 10 }}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLoggingIn(false);
                    }}
                  >
                    Create an account
                  </Link>
                </Typography>
              </Grid>
            </form>
          ) : (
            <form name="signUpForm" onSubmit={onSignUpFormSubmitted}>
              <TextField
                label="Username"
                placeholder="JohnDoe123"
                name="username"
                value={signUpFormInputData.username}
                error={errors.username.length !== 0}
                helperText={errors.username.length > 0 && errors.username[0]}
                disabled={isLoading}
                variant="outlined"
                fullWidth
                required
                style={{ marginBottom: '10px' }}
                onChange={onFormInputChanged}
              />

              {isUsingEmail ? (
                <TextField
                  type="email"
                  label="Email"
                  placeholder="username@example.com"
                  autoComplete="email"
                  name="email"
                  variant="outlined"
                  value={signUpFormInputData.email}
                  error={errors.email.length !== 0}
                  helperText={errors.email.length > 0 && errors.email[0]}
                  disabled={isLoading}
                  fullWidth
                  required
                  style={{ marginBottom: '10px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle email or phone"
                          onClick={() => {
                            setIsUsingEmail(false);
                          }}
                          onMouseDown={(e: React.MouseEvent) => {
                            e.preventDefault();
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={onFormInputChanged}
                />
              ) : (
                <>
                  <TextField
                    type="tel"
                    label="Phone number"
                    placeholder=""
                    name="phoneNumber"
                    variant="outlined"
                    value={signUpFormInputData.phoneNumber}
                    error={errors.phoneNumber.length !== 0}
                    helperText={
                      errors.phoneNumber.length > 0 && errors.phoneNumber[0]
                    }
                    fullWidth
                    disabled={isLoading}
                    required
                    style={{ marginBottom: '10px' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle email or phone"
                            onClick={() => {
                              setIsUsingEmail(true);
                            }}
                            onMouseDown={(e: React.MouseEvent) => {
                              e.preventDefault();
                            }}
                          >
                            <EmailIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onChange={onFormInputChanged}
                  />
                  <Autocomplete
                    style={{ marginBottom: '10px' }}
                    options={countryCodes}
                    autoHighlight
                    getOptionLabel={(option) => option.name}
                    renderOption={(option) => (
                      <React.Fragment>
                        <span>{countryToFlag(option.code)}</span>
                        <span style={{ marginLeft: 10 }}>
                          {option.name} ({option.dial_code})
                        </span>
                      </React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        label="Country"
                        {...params}
                        variant="outlined"
                        inputProps={{
                          ...params.inputProps,
                        }}
                      />
                    )}
                    onChange={onCountryInputChanged}
                  />
                </>
              )}

              <TextField
                type={isShowingPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                autoComplete="new-password"
                variant="outlined"
                value={signUpFormInputData.password}
                error={errors.password.length !== 0}
                helperText={errors.password.length > 0 && errors.password[0]}
                disabled={isLoading}
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
                name="passwordConfirmation"
                autoComplete="new-password"
                variant="outlined"
                fullWidth
                required
                value={signUpFormInputData.passwordConfirmation}
                error={errors.passwordConfirmation.length !== 0}
                helperText={
                  errors.passwordConfirmation.length > 0 &&
                  errors.passwordConfirmation[0]
                }
                disabled={isLoading}
                style={{ marginBottom: '10px' }}
                onChange={onFormInputChanged}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                style={{ marginTop: '30px', marginBottom: 20 }}
                disabled={!isValidFormInput() && isLoading}
              >
                Sign up
              </Button>
              <Grid container justify="flex-end">
                <Typography>
                  <Link
                    style={{ marginRight: 10 }}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLoggingIn(true);
                    }}
                  >
                    Already have an account?
                  </Link>
                </Typography>
              </Grid>
            </form>
          )}
        </Grid>
        <Grid item className={classes.oauth__form}>
          Oauth form
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
