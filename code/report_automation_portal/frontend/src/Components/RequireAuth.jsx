import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import PropTypes from 'prop-types';
import UserContext from './UserContext.jsx';

export default function RequireAuth({ allowedRoles }) {
  const value = useContext(UserContext);
  const location = useLocation();

  return value?.userType?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}

RequireAuth.defaultProps = {
  allowedRoles: ['Regular'],
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};
