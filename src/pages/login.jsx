/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { COOKIE, PAGES } from '../consts';
import { postLogin } from '../utils/api';
import { setCooike } from '../utils/cookies';
import './login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(false);
  return (
    <div className="pageWrapper">
      <div className="loginContainer">
        <h2>Login</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        {error && 'login failed'}
        <button
          type="submit"
          onClick={() => {
            setError(false);
            postLogin(username).then((res) => {
              console.log(res);
              if (res.data.username) {
                setCooike(COOKIE.USERNAME, res.data.username);
                window.location.href = PAGES.ACCOUNT;
              } else {
                setError(true);
              }
            }).catch(() => {
              setError(true);
            });
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
};
