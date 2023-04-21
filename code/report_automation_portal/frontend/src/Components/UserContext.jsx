import { createContext, useState } from 'react';
// import PropTypes from 'prop-types';

export const userContext = createContext(null);

export function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const value = {
    currentUser,
    setCurrentUser,
    userType,
    setUserType,
  };

  return <UserContextProvider value={value}>{children}</UserContextProvider>;
}

UserContextProvider.defaultProps = {
  children: true,
};

UserContextProvider.propTypes = {
  children: null,
};
