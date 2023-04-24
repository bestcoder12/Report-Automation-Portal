import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from './UserContext.jsx';

export default function RequireAuth({ allowedRoles }) {
  const value = useContext(UserContext);
  const location = useLocation();
  if (value?.userType?.find((role) => allowedRoles?.includes(role))) {
    return <Outlet />;
  }
  if (!value?.currentUser) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <Navigate to="/" state={{ from: location }} replace />;
  /* return value?.userType?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : value?.user ?
  <Navigate to="/unauthorized" state={{ from: location }} replace />
    :(
    <Navigate to="/" state={{ from: location }} replace />
  ); */
}

RequireAuth.defaultProps = {
  allowedRoles: ['Regular'],
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
