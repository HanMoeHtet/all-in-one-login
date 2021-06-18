import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/auth/authActions';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.authStore.user);
  const dispatch = useDispatch<AppDispatch>();

  if (!user) return null;

  const onLogOutBtnClicked = () => {
    dispatch(logout());
  };

  return (
    <div>
      {user.username}{' '}
      <button type="button" onClick={onLogOutBtnClicked}>
        Log out
      </button>
    </div>
  );
};

export default Home;
