import http from 'http';
import { server as WebSocketServer } from 'websocket';
import { MESSAGE } from './consts.js';
import { Player } from './player.js';

const server = http.createServer();
server.listen(9898);

const matches = {};

const wsServer = new WebSocketServer({
  httpServer: server,
});

const getMessage = (message) => message.split('|');

const getOtherPlayer = (match, name) => matches[match][Object.keys(matches[match])
  .find((player) => player !== name)];

const getThisPlayer = (match, name) => matches[match][name];

const sendMessageToOtherPlayer = (match, name, type, value) => {
  const connection = getOtherPlayer(match, name)?.connection;
  if (!connection) return;
  connection.sendUTF(`${type}|${value}`);
};
const sendMessageToPlayer = (match, name, type, value) => {
  const connection = getThisPlayer(match, name)?.connection;
  if (!connection) return;
  connection.sendUTF(`${type}|${value}`);
};

const updateBothClients = (match, player, playerLog, enemyLog) => {
  const playerState = getThisPlayer(match, player)?.getData();
  const enemyState = getOtherPlayer(match, player)?.getData();
  sendMessageToOtherPlayer(match, player, MESSAGE.TURN_END, JSON.stringify({
    enemyState: playerState,
    playerState: enemyState,
    log: playerLog && enemyLog && `${enemyLog} - ${playerLog}`,
  }));
  sendMessageToPlayer(match, player, MESSAGE.TURN_END, JSON.stringify({
    enemyState,
    playerState,
    log: playerLog && enemyLog && `${playerLog} - ${enemyLog}`,
  }));
};

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connection.on('message', (message) => {
    console.log('Received Message:', message.utf8Data);
    const [messageType, match, player, messageText] = getMessage(message.utf8Data);

    if (messageType === MESSAGE.PLAYER) {
      if (!matches[match]) {
        matches[match] = {};
      }
      matches[match] = {
        ...matches[match],
        [player]: new Player(
          connection,
          {
            name: player,
            ready: false,
          },
        ),
      };
      updateBothClients(match, player);
    }

    if (messageType === MESSAGE.MOVE) {
      const moves = JSON.parse(messageText);
      const thisPlayer = getThisPlayer(match, player);
      const otherPlayer = getOtherPlayer(match, player);
      console.log(thisPlayer?.getData());
      console.log(otherPlayer?.getData());
      thisPlayer.units.forEach((unit, i) => unit.setData({ nextMove: moves[i] }));
      thisPlayer.ready = true;
      if (otherPlayer.ready) {
        let enemyLog = '';
        let playerLog = '';
        for (let i = 0; i < 3; i += 1) {
          const enemyUnit = otherPlayer.units[i] || {};
          const playerUnit = thisPlayer.units[i] || {};
          const firstEnemyUnit = otherPlayer.units[0];
          const firstPlayerUnit = thisPlayer.units[0];
          const enemyPreHealth = enemyUnit.health;
          const playerPreHealth = playerUnit.health;
          let enemyMove = '';
          let playerMove = '';
          if (enemyUnit.moves) {
            enemyMove = enemyUnit.moves[enemyUnit.nextMove];
            enemyUnit.clearStatusEffects();
            enemyUnit.selfEffect();
            firstPlayerUnit.recieveEffect(enemyMove);
            enemyLog += `${otherPlayer.name}:${enemyUnit.name}: ${enemyMove.name}, ${enemyUnit.health - enemyPreHealth}hp\n`;
          }
          if (playerUnit.moves) {
            playerMove = playerUnit.moves[playerUnit.nextMove];
            playerUnit.clearStatusEffects();
            playerUnit.selfEffect();
            firstEnemyUnit.recieveEffect(playerMove);
            playerLog += `${thisPlayer.name}:${playerUnit.name}: ${playerMove.name}, ${playerUnit.health - playerPreHealth}hp\n`;
          }
        }

        for (let i = 0; i < 3; i += 1) {
          const enemyUnit = otherPlayer.units[i];
          const playerUnit = thisPlayer.units[i];
          if (enemyUnit && enemyUnit.health <= 0) {
            otherPlayer.units.shift();
          }
          if (playerUnit && playerUnit.health <= 0) {
            thisPlayer.units.shift();
          }
        }
        updateBothClients(match, player, playerLog, enemyLog);
        thisPlayer.ready = false;
        otherPlayer.ready = false;
      }
    }
  });
  connection.on('close', (reasonCode, description) => {
    console.log('Client has disconnected.');
  });
});
