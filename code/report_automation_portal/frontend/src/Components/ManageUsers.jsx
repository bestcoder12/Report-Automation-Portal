import { useCallback, useEffect, useMemo, useState } from 'react';
import getUsers from './GetUsers.js';
import ResSideBar from './SideBar.jsx';
import DispTable from './DispTable.jsx';
import './LayoutReportStyle.css';
import './LayoutManageUsers.css';
import ActionCells from './ActionCells.jsx';
import removeUser from './RemoveUser.js';
import AddUserForm from './AddUserForm.jsx';
import EditUserForm from './EditUserForm.jsx';

export default function ManageUsers() {
  const [userData, setUserData] = useState();
  const [toggleEdit, setToggleEdit] = useState(false);
  const [editData, setEditData] = useState();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [delUser, setDelUser] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [responseMesg, setResponseMesg] = useState();

  useEffect(() => {
    setIsSuccess(false);
    setResponseMesg('');
  }, []);

  const handleEdit = useCallback((original) => {
    setEditData(original);
    setToggleEdit(true);
  }, []);

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

  const handleAddSave = useCallback(
    (newUserData) => {
      const newTableRows = [...data, newUserData];
      setUserData(newTableRows);
    },
    [data]
  );

  const handleEditSave = useCallback(
    (editUser) => {
      setUserData(
        userData.map((user) => {
          if (user.username === editUser.username) {
            return editUser;
          }
          return user;
        })
      );
      setEditData(null);
      setToggleEdit(false);
    },
    [userData]
  );

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
      setIsSuccess(false);
      setResponseMesg(response.data.message);
    }
    handleDelete(delUser);
    closeConfirmation();
    setIsSuccess(true);
    setResponseMesg(response.data.message);
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

  const [toggleUserForm, setToggleUserForm] = useState(false);

  return (
    <div className="user-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Manage Users</h1>
        {responseMesg && (
          <p className={isSuccess ? 'success' : 'error'}>{responseMesg}</p>
        )}
        <div className="report-table-container">
          <DispTable columns={columns} data={data} cssClass="table" />
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
            <AddUserForm
              onSave={handleAddSave}
              onSuccess={setIsSuccess}
              forResponse={setResponseMesg}
            />
          )}
          <input
            type="button"
            value="Add User"
            onClick={() => setToggleUserForm(!toggleUserForm)}
          />
          {toggleEdit && (
            <EditUserForm
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
