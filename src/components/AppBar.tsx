import React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../store/auth/authActions';
import { AppDispatch, RootState } from '../store';

const AppBar = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(
    (state: RootState) => state.authStore.isAuthenticated
  );

  const onLogOutBtnClicked = () => {
    dispatch(logOut());
  };

  return (
    <MuiAppBar position="sticky" elevation={2}>
      <Toolbar style={{ position: 'relative' }}>
        <Box display="flex" width="100%" justifyContent="center">
          <Typography color="inherit" variant="h4">
            All in One Login
          </Typography>
        </Box>
        {isAuthenticated && (
          <Box display="flex" position="absolute" right="24px">
            <Button
              onClick={onLogOutBtnClicked}
              variant="contained"
              color="secondary"
            >
              <Typography>Log out</Typography>
            </Button>
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  );
});
export default AppBar;
