import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Grid,
  Typography,
  Link,
} from '@material-ui/core';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import { AppDispatch, RootState } from '../store';
import {
  signUpWithEmail,
  signUpWithPhoneNumber,
} from '../store/auth/authActions';
import { countryToFlag } from '../utils/countryToFlag';
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validatePhoneNumber,
} from '../utils/userValidation';
import countryCodes from '../utils/countryCodes.json';

interface FormInputData {
  username: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

interface Errors {
  username: string[];
  email: string[];
  phoneNumber: string[];
  password: string[];
  passwordConfirmation: string[];
}

const SignUpForm: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const [formInputData, setFormInputData] = useState<FormInputData>({
    username: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    password: '',
    passwordConfirmation: '',
  });

  const [errors, setErrors] = useState<Errors>({
    username: [],
    email: [],
    phoneNumber: [],
    password: [],
    passwordConfirmation: [],
  });

  const [isUsingEmail, setIsUsingEmail] = useState(true);
  const isLoading = useSelector(
    (state: RootState) => state.authStore.isLoading
  );
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const validateUsernameDebounced = useMemo(
    () =>
      _.debounce((username: string) => {
        if (username.length === 0) return;

        const [isValid, messages] = validateUsername(username);
        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            username: messages,
          }));
          return;
        }

        api
          .post('/validation/validateUsername', { username })
          .then(() => {
            setErrors((errors) => ({ ...errors, username: [] }));
          })
          .catch((err) => {
            const { errors: sserrors } = err.response.data;
            setErrors((errors) => ({
              ...errors,
              username: sserrors.username,
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

        const [isValid, messages] = validateEmail(email);

        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            email: messages,
          }));
          return;
        }

        const url = '/validation/validateEmail';
        api
          .post(url, { email })
          .then(() => {
            setErrors((errors) => ({ ...errors, email: [] }));
          })
          .catch((err) => {
            const { errors: sserrors } = err.response.data;
            setErrors((errors) => ({
              ...errors,
              email: sserrors.email,
            }));
          });
      }, 500),
    []
  );

  const validatePasswordDebounced = useMemo(
    () =>
      _.debounce((password: string) => {
        if (password.length === 0) return;
        const [isValid, messages] = validatePassword(password);
        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            password: messages,
          }));
          return;
        }

        setErrors((errors) => ({ ...errors, password: [] }));
      }, 500),
    []
  );

  const validatePasswordConfirmationDebounced = useMemo(
    () =>
      _.debounce((passwordConfirmation: string) => {
        if (
          passwordConfirmation.length === 0 ||
          formInputData.password.length === 0
        )
          return;

        const [isValid, messages] = validatePasswordConfirmation(
          passwordConfirmation,
          formInputData.password
        );
        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            passwordConfirmation: messages,
          }));
          return;
        }
        setErrors((errors) => ({ ...errors, passwordConfirmation: [] }));
      }, 500),
    [formInputData.password]
  );

  const validatePhoneNumberDebounced = useMemo(
    () =>
      _.debounce((phoneNumber: string) => {
        if (phoneNumber.length === 0) {
          return;
        }

        const [isValid, messages] = validatePhoneNumber(phoneNumber);

        if (!isValid) {
          setErrors((errors) => ({
            ...errors,
            phoneNumber: messages,
          }));
          return;
        }

        const url = '/validation/validatePhoneNumber';
        api
          .post(url, { phoneNumber })
          .then(() => {
            setErrors((errors) => ({ ...errors, phoneNumber: [] }));
          })
          .catch((err) => {
            const { errors: sserrors } = err.response.data;
            setErrors((errors) => ({
              ...errors,
              phoneNumber: sserrors.email,
            }));
          });
      }, 500),
    []
  );

  const onFormInputChanged = (e: React.ChangeEvent<{ value: unknown }>) => {
    const target = e.target as HTMLInputElement;

    setFormInputData({
      ...formInputData,
      [target.name]: target.value,
    });
    switch (target.name) {
      case 'username':
        validateUsernameDebounced(target.value);
        break;
      case 'email':
        validateEmailDebounced(target.value);
        break;
      case 'phoneNumber':
        if (formInputData.countryCode)
          validatePhoneNumberDebounced(
            formInputData.countryCode + target.value
          );
        break;
      case 'password':
        validatePasswordDebounced(target.value);
        if (formInputData.passwordConfirmation.length > 0) {
          validatePasswordConfirmationDebounced(
            formInputData.passwordConfirmation
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
    setFormInputData({
      ...formInputData,
      countryCode: value.dial_code,
    });
    validatePhoneNumberDebounced(value.dial_code + formInputData.phoneNumber);
  };

  const isValidFormInput = () => {
    for (let input of Object.values(formInputData)) {
      if (input.length === 0) {
        return false;
      }
    }
    return true;
  };

  const onSignUpFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password, passwordConfirmation } = formInputData;

    if (username.length === 0) {
      setErrors({
        ...errors,
        username: ['Username is required.'],
      });
      return;
    }

    if (isUsingEmail) {
      const { email } = formInputData;
      if (email === undefined || email.length === 0) {
        setErrors({
          ...errors,
          email: ['Email is required.'],
        });
        return;
      }
    } else {
      const { phoneNumber } = formInputData;
      if (phoneNumber === undefined || phoneNumber.length === 0) {
        setErrors({
          ...errors,
          phoneNumber: ['PhoneNumber is required.'],
        });
        return;
      }
    }

    if (password.length === 0) {
      setErrors({
        ...errors,
        password: ['Password is required.'],
      });
      return;
    }

    if (passwordConfirmation.length === 0) {
      setErrors({
        ...errors,
        passwordConfirmation: ['Password confirmation is required.'],
      });
      return;
    }

    if (isUsingEmail) {
      try {
        await dispatch(signUpWithEmail(formInputData));
        return history.push('/verifyEmail');
      } catch (err) {
        switch (err.status) {
          case 500:
            history.push('/500');
            break;
          case 400:
            setErrors(err.errors);
            break;
          default:
        }
      }
    } else {
      try {
        await dispatch(signUpWithPhoneNumber(formInputData));
        history.push('/verifyPhoneNumber');
      } catch (err) {
        switch (err.status) {
          case 500:
            history.push('/500');
            break;
          case 400:
            setErrors(err.errors);
            break;
          default:
        }
      }
    }
  };

  return (
    <form name="signUpForm" onSubmit={onSignUpFormSubmitted}>
      <TextField
        label="Username"
        placeholder="JohnDoe123"
        name="username"
        value={formInputData.username}
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
          value={formInputData.email}
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
            value={formInputData.phoneNumber}
            error={errors.phoneNumber.length !== 0}
            helperText={errors.phoneNumber.length > 0 && errors.phoneNumber[0]}
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
        value={formInputData.password}
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
                {isShowingPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
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
        value={formInputData.passwordConfirmation}
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
    </form>
  );
};

export default SignUpForm;
