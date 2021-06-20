import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import Box from '@material-ui/core/Box';
import { Typography } from '@material-ui/core';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.authStore.user);

  if (!user) {
    return null;
  }

  return (
    <Box>
      <Box style={{ marginTop: 30 }} display="flex" justifyContent="center">
        <Typography variant="h4">Welcome, {user.username}</Typography>
      </Box>
    </Box>
  );
};

export default Home;
