import React from 'react';
import { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Box } from '@material-ui/core';
import { Link } from 'react-router-dom';

const ServerError: React.FC = () => {
  useEffect(() => {
    document.title = '500 - Internal Server Error';
  });
  return (
    <Box display="flex" justifyContent="center" paddingTop="5vh">
      <Box>
        <Button
          style={{ textTransform: 'capitalize', marginBottom: '40px' }}
          color="primary"
          component={Link}
          to="/"
        >
          <Typography variant="body1">Home</Typography>
        </Button>
        <Typography variant="h3">500 - Internal Server Error</Typography>
      </Box>
    </Box>
  );
};

export default ServerError;
