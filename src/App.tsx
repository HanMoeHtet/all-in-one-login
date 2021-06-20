import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ServerError from './pages/ServerError';
import PageNotFound from './pages/PageNotFound';
import { AppDispatch, RootState } from './store';
import { Redirect } from 'react-router-dom';
import EmailVerification from './pages/EmailVerification';
import PhoneNumberVerification from './pages/PhoneNumberVerification';
import OAuthRedirect from './pages/OAuthRedirect';
import { useEffect, useState } from 'react';
import { checkAuth } from './store/auth/authActions';
import AppBar from './components/AppBar';
import { Box } from '@material-ui/core';
import oAuthProviders from './utils/oAuthProviders.json';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await dispatch(checkAuth());
      setIsLoading(false);
    })();
  }, [dispatch]);

  const isAuthenticated = useSelector(
    (state: RootState) => state.authStore.isAuthenticated
  );

  console.log('isAuth', isAuthenticated, 'isLoading', isLoading);

  if (isLoading) return null;

  return (
    <BrowserRouter>
      <Box display="flex" flexDirection="column" style={{ height: '100vh' }}>
        <Switch>
          <Route path={oAuthProviders.map((provider) => provider.uri)} exact>
            <OAuthRedirect />
          </Route>
          <Route path="/500" exact>
            <ServerError />
          </Route>
          <Route
            path={['/', '/login', '/verifyEmail', '/verifyPhoneNumber']}
            exact
          >
            <AppBar />
            <Box flexGrow="1">
              <Route path="/" exact>
                {isAuthenticated ? <Home /> : <Redirect to="/login" />}
              </Route>
              <Route path="/login" exact>
                {isAuthenticated ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/verifyEmail" exact>
                {isAuthenticated ? <Redirect to="/" /> : <EmailVerification />}
              </Route>
              <Route path="/verifyPhoneNumber" exact>
                {isAuthenticated ? (
                  <Redirect to="/" />
                ) : (
                  <PhoneNumberVerification />
                )}
              </Route>
            </Box>
          </Route>
          <Route path="*">
            <PageNotFound />
          </Route>
        </Switch>
      </Box>
    </BrowserRouter>
  );
}

export default App;
