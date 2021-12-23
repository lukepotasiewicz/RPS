import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { PAGES } from './consts.js';
import { Account } from './pages/account.jsx';
import { Game } from './pages/game.jsx';
import { Home } from './pages/home.jsx';
import { Login } from './pages/login.jsx';
import { Matchmaking } from './pages/matchmaking.jsx';

export const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path={PAGES.HOME} element={<Home />} />
      <Route path={PAGES.PLAY} element={<Matchmaking />} />
      <Route path={PAGES.GAME} element={<Game />} />
      <Route path={PAGES.ACCOUNT} element={<Account />} />
      <Route path={PAGES.LOGIN} element={<Login />} />
    </Routes>
  </BrowserRouter>
);
