export const validateUsername = (username: string): [boolean, string] => {
  if (username.includes(' ')) {
    return [false, 'Username must not contain whitespaces.'];
  }

  if (username.length < 6 || username.length > 16) {
    return [false, 'Username must be of length between 6 and 16.'];
  }

  const regex = /[a-zA-Z_0-9]/;
  if (!regex.test(username)) {
    return [
      false,
      'Username must be alphanumeric and contains only English characters.',
    ];
  }

  return [true, 'Username is valid.'];
};

export const validateEmail = (email: string): [boolean, string] => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regex.test(email)) {
    return [false, 'Email is not valid.'];
  }

  return [true, 'Email is valid.'];
};

export const validatePassword = (password: string): [boolean, string] => {
  if (password.length < 8 || password.length > 20) {
    return [false, 'Password must be of length between 8 and 20.'];
  }

  if (!/[a-z]{1}/.test(password)) {
    return [false, 'Password must contain at least one lowercase character.'];
  }

  if (!/[A-Z]{1}/.test(password)) {
    return [false, 'Password must contain at least one uppercase character.'];
  }

  if (!/[0-9]{1}/.test(password)) {
    return [false, 'Password must contain at least one number.'];
  }

  const regex = /[.!@#$%^&*()+\-={}[\]\\,./<>?|]{1}/;
  if (!regex.test(password)) {
    return [false, 'Password must contain at least one special character.'];
  }

  return [true, 'Password is valid'];
};

export const validatePasswordConfirmation = (
  passwordConfirmation: string,
  password: string
): [boolean, string] => {
  if (passwordConfirmation !== password) {
    return [false, 'Password confirmation does not match.'];
  }

  return [true, 'Passwords match.'];
};
