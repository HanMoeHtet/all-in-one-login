import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch } from '../store';
import { redirectOauth } from '../store/auth/authActions';
import oAuthLinks from '../utils/oAuthLinks.json';

const OAuthRedirect: React.FC = () => {
  const { pathname, search } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      await dispatch(redirectOauth(pathname + search));
      window.close();
    })();
  }, [pathname, search, dispatch]);

  return null;
};

export default OAuthRedirect;
