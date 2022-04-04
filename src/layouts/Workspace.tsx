import axios from 'axios';
import { FC, useCallback } from 'react';
import { Navigate } from 'react-router';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';

const Workspace: FC = ({ children }) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

  const logOut = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  if (!data) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <button onClick={logOut}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
