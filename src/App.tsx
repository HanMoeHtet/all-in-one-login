import { useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import { RootState } from './store';
import { Redirect } from 'react-router-dom';

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
      </Switch>
    </BrowserRouter>
  );
}

export default App;
