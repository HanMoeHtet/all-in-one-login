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
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { logIn } from '../store/auth/authActions';
import { LogInFormInputData } from '../store/auth/types';

const LogInForm: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();

  const isLoading = useSelector(
    (state: RootState) => state.authStore.isLoading
  );

  const [formInputData, setFormInputData] = useState<LogInFormInputData>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<{
    username: string[];
    password: string[];
  }>({
    username: [],
    password: [],
  });

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const onFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    if (formInputData.username.length === 0) {
      setErrors({
        ...errors,
        username: ['Username is required.'],
      });
      isValid = false;
    }

    if (formInputData.password.length === 0) {
      setErrors({
        ...errors,
        password: ['Password is required.'],
      });

      isValid = false;
    }

    if (!isValid) return;

    try {
      await dispatch(logIn(formInputData));
      history.push('/');
    } catch (err) {
      switch (err.status) {
        case 500:
          history.push('/500');
          break;
        case 401:
        case 404:
          setErrors({ ...errors, ...err.errors });
          break;
        default:
      }
    }
  };

  const isValidFormInput = () => {
    for (let input of Object.values(formInputData)) {
      if (input.length === 0) {
        return false;
      }
    }
    return true;
  };

  return (
    <form name="LogInForm" onSubmit={onFormSubmitted}>
      <TextField
        label="Username"
        name="username"
        autoComplete="username"
        value={formInputData.username}
        disabled={isLoading}
        variant="outlined"
        fullWidth
        required
        error={errors.username.length !== 0}
        helperText={errors.username[0]}
        style={{ marginBottom: '10px' }}
        onChange={(e) =>
          setFormInputData({
            ...formInputData,
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
        value={formInputData.password}
        disabled={isLoading}
        fullWidth
        required
        error={errors.password.length !== 0}
        helperText={errors.password[0]}
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
        onChange={(e) =>
          setFormInputData({
            ...formInputData,
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
    </form>
  );
};

export default LogInForm;
