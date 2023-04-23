import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from './UserContext.jsx';

export default function RequireAuth() {
  const value = useContext(UserContext);
  const location = useLocation();

  return value?.currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
