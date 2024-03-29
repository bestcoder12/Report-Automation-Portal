import { useState } from 'react';
import PropTypes from 'prop-types';
import createUser from './CreateUser.js';
import DropDownMenu from './DropDownMenu.jsx';

export default function AddUserForm({ onSave, onSuccess, forResponse }) {
  const [userName, setUserName] = useState();
  const [passwrd, setPasswrd] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const userTypeOpts = [
    { label: 'Regular User', value: 'Regular' },
    { label: 'Uploading User', value: 'Uploading' },
    { label: 'Administrator', value: 'Admin' },
  ];
  const [userType, setUserType] = useState(userTypeOpts[0].value);

  const userRoleOpts = [
    { label: 'CGM', value: 'CGM' },
    { label: 'GM', value: 'GM' },
    { label: 'DGM', value: 'DGM' },
    { label: 'SDO', value: 'SDO' },
    { label: 'NE', value: 'NE' },
  ];
  const [userRole, setUserRole] = useState(userRoleOpts[0].value);
  const [newUser, setNewUser] = useState({
    username: userName,
    password: passwrd,
    user_type: userType,
    user_role: userRole,
  });

  const handleUserType = (e) => {
    setUserType(e.target.value);
    setNewUser((prevState) => ({
      ...prevState,
      user_type: e.target.value,
    }));
    onSuccess(false);
    forResponse('');
  };

  const handleUserRole = (e) => {
    setUserRole(e.target.value);
    setNewUser((prevState) => ({
      ...prevState,
      user_role: e.target.value,
    }));
    onSuccess(false);
    forResponse('');
  };

  const handleUsername = (e) => {
    setUserName(e.target.value);
    setNewUser((prevState) => ({
      ...prevState,
      username: e.target.value,
    }));
    onSuccess(false);
    forResponse('');
  };

  const handlePasswrd = (e) => {
    setPasswrd(e.target.value);
    setNewUser((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
    onSuccess(false);
    forResponse('');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setNewUser({
      username: userName,
      password: passwrd,
      user_type: userType,
      user_role: userRole,
    });
    const response = await createUser(newUser);
    if (response.statusCode === 200) {
      const newUserData = { ...newUser };
      delete newUserData.password;
      onSuccess(true);
      forResponse(response.data.message);
      onSave(newUserData);
    } else {
      onSuccess(false);
      forResponse(response.data.message);
    }
  };

  return (
    <form
      action=""
      method="POST"
      onSubmit={handleCreateUser}
      className="form-users"
    >
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter a username..."
        onChange={handleUsername}
      />
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        id="password"
        placeholder="Enter a pasword..."
        onChange={handlePasswrd}
      />
      <DropDownMenu
        domFor="add-user-type"
        domLabelId="add-type-label"
        label="Select type of user"
        options={userTypeOpts}
        value={userType}
        onChange={handleUserType}
      />
      <DropDownMenu
        domFor="add-user-role"
        domLabelId="add-role-label"
        label="Select role of user"
        options={userRoleOpts}
        value={userRole}
        onChange={handleUserRole}
      />
      <div className="login-chk">
        <input type="checkbox" onClick={togglePassword} />
        Show Password
      </div>
      <button type="submit">Create user</button>
    </form>
  );
}

AddUserForm.defaultProps = {
  onSave: () => {},
  onSuccess: () => {},
  forResponse: () => {},
};

AddUserForm.propTypes = {
  onSave: PropTypes.func,
  onSuccess: PropTypes.func,
  forResponse: PropTypes.func,
};
