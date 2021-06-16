const MIN_USERNAME_LENGTH = 6;
const MAX_USERNAME_LENGTH = 16;

export const validateUsername = (
  username: string,
  { required = false } = {}
): [boolean, string[]] => {
  let isValid = true;
  const messages = [];

  if (required && username.length === 0) {
    isValid = false;
    messages.push('Username is required.');
  }

  if (username.includes(' ')) {
    isValid = false;
    messages.push('Username must not contain whitespaces.');
  }

  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    isValid = false;
    messages.push(
      `Username must be of length between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH}.`
    );
  }

  const regex = /[a-zA-Z_0-9]/;
  if (!regex.test(username)) {
    isValid = false;
    messages.push(
      'Username must be alphanumeric and contains only English characters.'
    );
  }

  return [isValid, messages];
};

export const validateEmail = (
  email: string,
  { required = false } = {}
): [boolean, string[]] => {
  let isValid = true;
  const messages = [];

  if (required && email.length === 0) {
    isValid = false;
    messages.push('Email is required.');
  }

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    isValid = false;
    messages.push('Email is not valid.');
  }

  return [isValid, messages];
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 20;
export const validatePassword = (
  password: string,
  { required = false } = {}
): [boolean, string[]] => {
  let isValid = true;
  const messages = [];

  if (required && password.length === 0) {
    isValid = true;
    messages.push('Password is required.');
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    isValid = false;
    messages.push(
      `Password must be of length between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}.`
    );
  }

  if (!/[a-z]{1}/.test(password)) {
    isValid = false;
    messages.push('Password must contain at least one lowercase character.');
  }

  if (!/[A-Z]{1}/.test(password)) {
    isValid = false;
    messages.push('Password must contain at least one uppercase character.');
  }

  if (!/[0-9]{1}/.test(password)) {
    isValid = false;
    messages.push('Password must contain at least one number.');
  }

  const regex = /[.!@#$%^&*()+\-={}[\]\\,./<>?|]{1}/;
  if (!regex.test(password)) {
    isValid = false;
    messages.push('Password must contain at least one special character.');
  }

  return [isValid, messages];
};

export const validatePasswordConfirmation = (
  passwordConfirmation: string,
  password: string,
  { required = false } = {}
): [boolean, string[]] => {
  let isValid = true;
  const messages = [];
  if (required && passwordConfirmation.length === 0) {
    isValid = false;
    messages.push('Password confirmation is required.');
  }

  if (passwordConfirmation !== password) {
    isValid = false;
    messages.push('Password confirmation does not match.');
  }

  return [isValid, messages];
};
