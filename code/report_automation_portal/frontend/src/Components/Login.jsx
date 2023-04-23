import { useState, useContext } from 'react';
// import { redirect } from 'react-router-dom';
import './LoginStyle.css';
import { useNavigate } from 'react-router-dom';
import loginAuth from './LoginAuth.js';
import UserContext from './UserContext.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [passwrd, setPasswrd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const value = useContext(UserContext);
  const { setCurrentUser, setUserType, failLogin, setFailLogin } = value;

  const navigate = useNavigate();
  console.log(typeof setUserType);

  const checkCred = async (e) => {
    e.preventDefault();
    const userCred = { username, password: passwrd };
    const response = await loginAuth(userCred);
    console.log(response);
    if (response.statusCode === 200) {
      setCurrentUser(username);
      return navigate('/dashboard');
    }
    setFailLogin(true);
    return navigate('/');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Report Automation Portal</h1>
      <div className="container">
        <div className="wrong-message">
          {failLogin ? (
            <p>Wrong username or password. Please check your credentials.</p>
          ) : (
            <div />
          )}
        </div>
        <div className="wrapper">
          <div id="login-heading">Login</div>
          <form action="" method="POST" onSubmit={checkCred}>
            <div className="login-row">
              <label htmlFor="username">
                Username
                <div className="login-username">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="login-row">
              <label htmlFor="passwrd">
                Password
                <div className="login-passwd">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="passwrd"
                    id="passwrd"
                    value={passwrd}
                    onChange={(e) => setPasswrd(e.target.value)}
                  />
                </div>
              </label>
            </div>
            <div className="login-chk">
              <input type="checkbox" onClick={togglePassword} />
              Show Password
            </div>
            <button id="login-button" type="submit">
              Log in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
