import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.authStore.user);

  if (!user) return null;

  return <div>{user.username}</div>;
};

export default Home;
