import { createContext } from 'react';
// import PropTypes from 'prop-types';

const UserContext = createContext(null);
export default UserContext;

/* export function UserContextProvider(props) {
  const { children, value } = props;
  // const {currentUser, setCurrentUser, userType, setUserType} = value;
  // const [currentUser, setCurrentUser] = useState(null);
  // const [userType, setUserType] = useState(null);

  console.log(children);

  return <UserContextProvider value={value}>{children}</UserContextProvider>;
} */

/*   UserContextProvider.defaultProps = {
    value: null,
    children: null,
  };

  UserContextProvider.propTypes = {
    value: PropTypes.shape({
      currentUser: PropTypes.string,
      setCurrentUser: PropTypes.func,
      userType: PropTypes.string,
      setUserType: PropTypes.func,
    }),
    children: PropTypes.element,
  };
 */
