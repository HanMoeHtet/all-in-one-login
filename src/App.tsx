import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { RootState } from './store';
import { Redirect } from 'react-router-dom';
import EmailVerification from './pages/EmailVerification';
import PhoneNumberVerification from './pages/PhoneNumberVerification';

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.authStore.isAuthenticated
  );

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
      </Switch>
    </BrowserRouter>
  );
}

export default App;
