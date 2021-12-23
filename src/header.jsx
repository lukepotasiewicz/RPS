import React from 'react';
import { Link } from 'react-router-dom';
import { COOKIE, PAGES } from './consts';
import './header.css';
import { setCooike, USER } from './utils/cookies.js';

const makeClass = (selected, page) => (selected === page ? 'navLink selected' : 'navLink');

export const Header = ({ selected }) => {
  if (!USER.username) {
    window.location.href = '/login';
  }
  return (
    <header className="header">
      <h1>Rune Paper Sword</h1>
      <Link to={PAGES.HOME} className={makeClass(selected, PAGES.HOME)}>Home</Link>
      <Link to={PAGES.PLAY} className={makeClass(selected, PAGES.PLAY)}>Play</Link>
      <Link to={PAGES.ACCOUNT} className={makeClass(selected, PAGES.ACCOUNT)}>Account</Link>
      <button
        type="button"
        className="navLink right"
        onClick={() => {
          setCooike(COOKIE.USERNAME, '');
          window.location.href = PAGES.LOGIN;
        }}
      >
        Log Out
      </button>
    </header>
  );
};
