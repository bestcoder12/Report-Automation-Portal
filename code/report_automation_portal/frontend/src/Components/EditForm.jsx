import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import updateUser from './UpdateUser.js';
import DropDownMenu from './DropDownMenu';

export default function EditForm({ user, onSave, onCancel }) {
  const [username, setUsername] = useState(user ? user.username : '');
  const [passwrd, setPasswrd] = useState('');
  const [userType, setUserType] = useState(user ? user.user_type : '');
  const [userRole, setUserRole] = useState(user ? user.user_role : '');

  const userTypeOpts = [
    { label: 'Regular User', value: 'Regular' },
    { label: 'Uploading User', value: 'Uploading' },
    { label: 'Administrator', value: 'Admin' },
  ];

  const userRoleOpts = [
    { label: 'CGM', value: 'CGM' },
    { label: 'GM', value: 'GM' },
    { label: 'DGM', value: 'DGM' },
    { label: 'SDO', value: 'SDO' },
    { label: 'NE', value: 'NE' },
  ];

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserType(user.user_type);
      setUserRole(user.user_role);
    }
  }, [user]);

  const handlePasswrd = (e) => {
    setPasswrd(e.target.value);
  };

  const handleUserType = (e) => {
    setUserType(e.target.value);
  };

  const handleUserRole = (e) => {
    setUserRole(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const editUser = {
      username,
      password: passwrd,
      user_type: userType,
      user_role: userRole,
    };
    const response = await updateUser(editUser);
    if (response.statusCode !== 201) {
      return <div>response.data.message</div>;
    }
    onSave(editUser);
    return response.statusCode;
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form
      action=""
      method="post"
      onSubmit={handleEditSubmit}
      className="form-users"
    >
      <input
        type="text"
        name="username"
        id="username"
        value={username}
        readOnly
      />
      <input
        type="text"
        name="password"
        id="password"
        onChange={handlePasswrd}
      />
      <DropDownMenu
        domFor="edit-user-type"
        domLabelId="edit-type-label"
        label="Select type of user"
        options={userTypeOpts}
        value={userType}
        onChange={handleUserType}
      />
      <DropDownMenu
        domFor="edit-user-role"
        domLabelId="edit-role-label"
        label="Select role of user"
        options={userRoleOpts}
        value={userRole}
        onChange={handleUserRole}
      />
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

EditForm.defaultProps = {
  user: {
    username: '',
    user_type: '',
    user_role: '',
  },
  onSave: () => {},
  onCancel: () => {},
};

EditForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    user_type: PropTypes.string,
    user_role: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};
