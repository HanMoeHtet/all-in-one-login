import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

export const configureAuthHeader = (token: string) => {
  api.defaults.headers = {
    Authorization: `Bearer ${token}`,
  };
};

export default api;
