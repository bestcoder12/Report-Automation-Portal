import { useContext, useEffect, useState } from 'react';
import ResSideBar from './SideBar.jsx';
import updateUser from './UpdateUser.js';
import UserContext from './UserContext.jsx';

export default function ChangePassword() {
  const [newPasswrd, setNewPasswrd] = useState(null);
  const [cnfrmNewPass, setCnfrmNewPass] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passMatch, setPassMatch] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [responseMesg, setResponseMesg] = useState();
  const { currentUser } = useContext(UserContext);

  useEffect(() => setPassMatch(false), []);
  useEffect(() => {
    if (!newPasswrd && !cnfrmNewPass) {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
    }
  }, [newPasswrd, cnfrmNewPass]);

  const handlePassChange = (e) => {
    const newPasswrdValue = e.target.value;
    setNewPasswrd(newPasswrdValue);

    if (!newPasswrdValue) {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
    } else if (newPasswrdValue !== cnfrmNewPass) {
      setPassMatch(false);
      setResponseMesg('Passwords do not match');
      setIsSuccess(false);
    } else {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
    }
  };

  const handleCnfrmChange = (e) => {
    const cnfrmPassValue = e.target.value;
    setCnfrmNewPass(cnfrmPassValue);

    if (!cnfrmPassValue) {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
    } else if (cnfrmPassValue !== newPasswrd) {
      setPassMatch(false);
      setResponseMesg('Passwords do not match');
      setIsSuccess(false);
    } else {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();

    if (!newPasswrd && !cnfrmNewPass) {
      setPassMatch(true);
      setResponseMesg('');
      setIsSuccess(false);
      return;
    }

    if (newPasswrd !== cnfrmNewPass) {
      setPassMatch(false);
      setResponseMesg('Passwords do not match');
      setIsSuccess(false);
      return;
    }

    const newUserData = {
      username: currentUser,
      password: newPasswrd,
    };

    const response = await updateUser(newUserData);
    if (response.statusCode !== 201) {
      setIsSuccess(false);
    }
    setIsSuccess(true);
    setResponseMesg(response.data.message);
  };

  console.log(newPasswrd, cnfrmNewPass, passMatch);

  return (
    <div className="user-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Change Password</h1>
        {responseMesg && (
          <p className={isSuccess ? 'success' : 'error'}>{responseMesg}</p>
        )}
        <div className="wrapper">
          <form action="" method="post" onSubmit={handlePassSubmit}>
            <label htmlFor="password">
              Enter new password
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                onChange={handlePassChange}
              />
            </label>
            <label htmlFor="cnfrm-pass">
              Confirm new password
              <input
                type={showPassword ? 'text' : 'password'}
                name="cnfrm-pass"
                id="cnfrm-pass"
                onChange={handleCnfrmChange}
              />
            </label>
            <div className="login-chk">
              <input type="checkbox" onClick={togglePassword} />
              Show Password
            </div>
            <button type="button" className="form-button" disabled={!passMatch}>
              Change password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
