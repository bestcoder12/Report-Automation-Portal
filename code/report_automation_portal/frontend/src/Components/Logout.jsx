import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import UserContext from './UserContext';
import clrSessn from './ClrSessn.js';

/* const lgoutUser = async () => {
  await clrSessn();
}; */

export default function Logout() {
  const value = useContext(UserContext);
  const navigate = useNavigate();
  const { setCurrentUser, setUserType } = value;
  useEffect(() => {
    setCurrentUser(null);
    setUserType(null);
  });
  useEffect(() => {
    const logoutWrapper = async () => {
      await clrSessn();
    };
    logoutWrapper();
  });
  return navigate('/');
}
