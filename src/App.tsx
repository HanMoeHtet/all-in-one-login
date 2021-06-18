import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { RootState } from './store';
import { Redirect } from 'react-router-dom';
import EmailVerification from './pages/EmailVerification';
import PhoneNumberVerification from './pages/PhoneNumberVerification';
import OAuthRedirect from './pages/OAuthRedirect';
import oAuthLinks from './utils/oAuthLinks.json';

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authStore.isAuthenticated
  );

  const isLoading = useSelector(
    (state: RootState) => state.authStore.isLoading
  );

  if (isLoading) return null;

  return (
    <BrowserRouter>
      <Switch>
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
          {isAuthenticated ? <Redirect to="/" /> : <PhoneNumberVerification />}
        </Route>
        <Route path={oAuthLinks.map((item) => item.uri)} exact>
          <OAuthRedirect />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
