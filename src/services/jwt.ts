const tokenName = 'AIOL-TOKEN';

export const setToken = (token: string): void => {
  localStorage.setItem(tokenName, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(tokenName);
};

export const removeToken = (): void => {
  localStorage.removeItem(tokenName);
};
