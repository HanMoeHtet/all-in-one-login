import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AppDispatch } from '../store';
import { redirectOAuth } from '../store/auth/authActions';

const OAuthRedirect: React.FC = () => {
  const { pathname, search } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      await dispatch(redirectOAuth(pathname + search));
      window.close();
    })();
  }, [pathname, search, dispatch]);

  return null;
};

export default OAuthRedirect;
