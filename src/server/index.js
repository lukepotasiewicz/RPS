import express from 'express';
import './socket.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import { generateUnit } from './utils/generateUnit.js';
import { readUserDB, writeUserDB } from './database.js';
import { matchmakingRouter } from './matchmaking.js';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/api/login', (req, res) => {
  const username = req.body.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  if (username.length > 40) {
    return res.send(400);
  }

  const users = readUserDB();
  if (users[username]) {
    return res.send({ username });
  }
  writeUserDB({
    [username]: {
      lootboxes: 5, coin: 50, lineup: {}, units: {},
    },
  });
  return res.send({ username });
});

app.get('/api/user', (req, res) => {
  const username = req.query.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  const user = readUserDB()[username];
  return res.send({ user });
});

app.get('/api/open-lootbox', (req, res) => {
  const username = req.query.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  const user = readUserDB()[username];
  if (user.lootboxes <= 0) {
    return res.send({ user });
  }
  user.lootboxes -= 1;
  const id = Math.ceil(Math.random() * 10000000000);
  user.units[id] = generateUnit();

  writeUserDB({ [username]: user });
  return res.send({ user });
});

app.post('/api/addToLineup', (req, res) => {
  const username = req.body.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');
  const unitId = req.body.unitId.replace(/[^0-9]+/gi, '');

  const user = readUserDB()[username];
  if (Object.keys(user.lineup).length >= 3) {
    return res.send(200);
  }
  const unitToMove = user.units[unitId];
  if (!unitToMove) {
    return res.send(400);
  }
  user.units[unitId] = undefined;
  user.lineup[unitId] = unitToMove;

  writeUserDB({ [username]: user });
  return res.send({ user });
});

app.post('/api/removeFromLineup', (req, res) => {
  const username = req.body.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');
  const unitId = req.body.unitId.replace(/[^0-9]+/gi, '');

  const user = readUserDB()[username];
  const unitToMove = user.lineup[unitId];
  if (!unitToMove) {
    return res.send(400);
  }
  user.lineup[unitId] = undefined;
  user.units[unitId] = unitToMove;

  writeUserDB({ [username]: user });
  return res.send({ user });
});

app.get('/clear', (req, res) => {
  const username = req.query.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');
  const db = readUserDB();
  db[username] = undefined;
  fs.writeFileSync('users.json', JSON.stringify(db));
  res.send('ceared');
});

app.get('/give', (req, res) => {
  const username = req.query.username.replace(/[^0-9a-zA-Z-_ ]+/gi, '');

  const user = readUserDB()[username];
  user.lootboxes += 5;

  writeUserDB({ [username]: user });
  return res.send({ user });
});

app.use('/api', matchmakingRouter);
