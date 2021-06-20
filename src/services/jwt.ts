const tokenName = 'aiol-token';

export const setToken = (token: string): void => {
  localStorage.setItem(tokenName, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(tokenName);
};

export const removeToken = (): void => {
  localStorage.removeItem(tokenName);
};
