import express from 'express';
import './socket.js';
import {
  readMatchesDB, writeMatchesDB,
} from './database.js';

export const matchmakingRouter = express.Router();

matchmakingRouter.get('/matches', (req, res) => {
  const matches = readMatchesDB();

  return res.send({ matches });
});

matchmakingRouter.post('/makeMatch', (req, res) => {
  const username = req.body.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  const matches = readMatchesDB();
  matches[username] = {
    name: username,
  };

  writeMatchesDB(matches);

  return res.send({ matches });
});

matchmakingRouter.post('/joinMatch', (req, res) => {
  const username = req.body.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  const matches = readMatchesDB();
  matches[username] = undefined;

  writeMatchesDB(matches);

  return res.send({ matches });
});
