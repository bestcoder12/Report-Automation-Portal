import { useState } from 'react';
import './LoginStyle.css';
import loginAuth from './LoginAuth.js';

export default async function Login() {
  const [username, setUsername] = useState('');
  const [passwrd, setPasswrd] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkCred = async (e) => {
    e.preventDefault();
    const userCred = { username, password: passwrd };
    const res = await loginAuth(userCred);
    console.log(res);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  await loginAuth();

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Report Automation Portal</h1>
      <div className="container">
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
