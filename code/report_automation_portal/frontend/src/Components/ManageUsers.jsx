import { useEffect, useMemo, useState } from 'react';
import getUsers from './GetUsers.js';
import createUser from './CreateUser.js';
import ResSideBar from './SideBar.jsx';
import DispTable from './DispTable.jsx';
import './LayoutReportStyle.css';
import DropDownMenu from './DropDownMenu.jsx';

export default function ManageUsers() {
  const [userCols, setUserCols] = useState([
    {
      Header: 'Username',
      accessor: 'username',
    },
    {
      Header: 'User Type',
      accessor: 'user_type',
    },
    {
      Header: 'User Role',
      accessor: 'user_role',
    },
  ]);

  const [userData, setUserData] = useState();

  useEffect(() => {
    (async () => {
      const response = await getUsers();
      if (response.statusCode !== 200) {
        setUserData([]);
      }
      setUserData(response.data);
    })();
  });

  const columns = useMemo(() => userCols, [userCols]);

  const data = useMemo(() => userData, [userData]);

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

  const [toggleUserForm, setToggleUserForm] = useState(false);
  const [userName, setUserName] = useState();
  const [passwrd, setPasswrd] = useState();
  const [newUser, setNewUser] = useState({
    username: 'JKL',
    password: 'MNO',
    user_type: 'PQR',
    user_role: 'STU',
  });

  const handleUserType = (e) => {
    setUserType(e.target.value);
  };

  const handleUserRole = (e) => {
    setUserRole(e.target.value);
  };

  /* const handleFormChange = (e) => {
    e.preventDefault();

    const fieldName = e.target.getAttribute('name');
    const fieldValue = e.target.value;

    const newUserData = { ...newUser };
    newUserData[fieldName] = fieldValue;
    setNewUser(newUserData);
  }; */

  const handleUsername = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handlePasswrd = (e) => {
    e.preventDefault();
    setPasswrd(e.target.value);
  };

  /* const handleAddUser = async () => {
    setCreateUser(true);
  }; */

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
      const newTableRows = [...data, newUserData];
      setUserData(newTableRows);
      setUserCols(userCols);
    }
  };

  return (
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Manage Users</h1>
        <div className="report-table-container">
          <DispTable columns={columns} data={data} />
        </div>
        <div className="add-button">
          {toggleUserForm ? (
            <form action="" method="POST" onSubmit={handleCreateUser}>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter a username..."
                onChange={handleUsername}
              />
              <input
                type="password"
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
              <button type="submit">Create user</button>
            </form>
          ) : (
            <div />
          )}
          <input
            type="button"
            value="Add User"
            onClick={() => setToggleUserForm(!toggleUserForm)}
          />
        </div>
      </div>
    </div>
  );
}
