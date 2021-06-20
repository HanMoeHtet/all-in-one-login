import React from 'react';
import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Not found';
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
        <Typography variant="h3">404 - Page Not Found</Typography>
      </Box>
    </Box>
  );
};

export default PageNotFound;
