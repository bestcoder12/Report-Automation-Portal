import { useState } from 'react';
import { redirect } from 'react-router-dom';
import './LoginStyle.css';
import loginAuth from './LoginAuth.js';

export default function Login() {
  const [username, setUsername] = useState('');
  const [passwrd, setPasswrd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failLogin, setFailLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const corrLogin = () => {
    if (currentUser) {
      return redirect('/dashboard');
    }
    return redirect('/login');
  };

  const checkCred = async (e) => {
    e.preventDefault();
    const userCred = { username, password: passwrd };
    const response = await loginAuth(userCred);
    if (response.statusCode === 200) {
      setCurrentUser(username);
    } else {
      setFailLogin(true);
    }
    corrLogin();
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
