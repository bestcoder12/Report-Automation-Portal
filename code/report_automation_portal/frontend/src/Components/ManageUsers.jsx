import { useCallback, useEffect, useMemo, useState } from 'react';
import getUsers from './GetUsers.js';
import createUser from './CreateUser.js';
import ResSideBar from './SideBar.jsx';
import DispTable from './DispTable.jsx';
import './LayoutReportStyle.css';
import './LayoutManageUsers.css';
import DropDownMenu from './DropDownMenu.jsx';
import ActionCells from './ActionCells.jsx';
import removeUser from './RemoveUser.js';
import EditForm from './EditForm.jsx';

export default function ManageUsers() {
  const [userData, setUserData] = useState();
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editData, setEditData] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [delUser, setDelUser] = useState();

  const handleEdit = useCallback(
    (original) => {
      setEditData(original);
      setToggleEdit(!toggleEdit);
    },
    [toggleEdit]
  );

  const handleEditSave = useCallback(() => {
    setUserData(
      userData.map((user) => {
        if (user.username === editData.username) {
          return editData;
        }
        return user;
      })
    );
    setEditData(null);
    setToggleEdit(false);
  }, [userData, editData]);

  const handleOnCancel = useCallback(() => {
    setEditData(null);
    setToggleEdit(false);
  }, []);

  const openConfirmation = useCallback(
    (original) => {
      setDelUser(original);
      setShowConfirmation(true);
    },
    [setDelUser, setShowConfirmation]
  );

  const closeConfirmation = () => {
    setDelUser(null);
    setShowConfirmation(false);
  };

  const handleDelete = useCallback(() => {
    const updatedUsers = userData.filter(
      (user) => user.username !== delUser.username
    );
    setUserData(updatedUsers);
  }, [userData, delUser]);

  const deleteUser = async () => {
    const response = await removeUser(delUser);
    if (response.statusCode !== 200) {
      return <div>Could not delete user</div>;
    }
    handleDelete(delUser);
    closeConfirmation();
    return response.statusCode;
  };

  const renderActionCells = useCallback(
    ({ row }) => (
      <ActionCells
        original={row.original}
        onEdit={handleEdit}
        onDelete={openConfirmation}
      />
    ),
    [handleEdit, openConfirmation]
  );

  const columns = useMemo(
    () => [
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
      {
        Header: 'Actions',
        Cell: renderActionCells,
        accessor: 'actions',
      },
    ],
    [renderActionCells]
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUsers();
      if (response.statusCode !== 200) {
        setUserData([]);
      }
      setUserData(response.data);
    };
    fetchData();
  }, []);

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

  const handleUsername = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handlePasswrd = (e) => {
    e.preventDefault();
    setPasswrd(e.target.value);
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
      const newTableRows = [...data, newUserData];
      setUserData(newTableRows);
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
        {showConfirmation && (
          <div className="confirmation-message">
            <p>Are you sure you want to delete {delUser.name}?</p>
            <input
              type="button"
              className="confirm-button"
              value="Yes"
              onClick={deleteUser}
            />
            <input
              type="button"
              className="cancel-button"
              value="No"
              onClick={closeConfirmation}
            />
          </div>
        )}
        <div className="add-button">
          {toggleUserForm && (
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
          )}
          <input
            type="button"
            value="Add User"
            onClick={() => setToggleUserForm(!toggleUserForm)}
          />
          {toggleEdit && (
            <EditForm
              user={editData}
              onSave={handleEditSave}
              onCancel={handleOnCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
