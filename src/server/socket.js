import http from 'http';
import { server as WebSocketServer } from 'websocket';
import { MESSAGE } from './consts.js';
import { Player } from './player.js';

const server = http.createServer();
server.listen(9898);

const players = {};

const wsServer = new WebSocketServer({
  httpServer: server,
});

const getMessage = (message) => message.split('|');

const getOtherPlayer = (name) => players[Object.keys(players).find((player) => player !== name)];

const getThisPlayer = (name) => players[Object.keys(players).find((player) => player === name)];

const sendMessageToOtherPlayer = (name, type, value) => {
  const connection = getOtherPlayer(name)?.connection;
  if (!connection) return;
  connection.sendUTF(`${type}|${value}`);
};
const sendMessageToPlayer = (name, type, value) => {
  const connection = getThisPlayer(name)?.connection;
  if (!connection) return;
  connection.sendUTF(`${type}|${value}`);
};

const updateBothClients = (player, playerLog, enemyLog) => {
  const playerState = getThisPlayer(player)?.getData();
  const enemyState = getOtherPlayer(player)?.getData();
  sendMessageToOtherPlayer(player, MESSAGE.TURN_END, JSON.stringify({
    enemyState: playerState,
    playerState: enemyState,
    log: playerLog && enemyLog && `${enemyLog} - ${playerLog}`,
  }));
  sendMessageToPlayer(player, MESSAGE.TURN_END, JSON.stringify({
    enemyState,
    playerState,
    log: playerLog && enemyLog && `${playerLog} - ${enemyLog}`,
  }));
};

wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connection.on('message', (message) => {
    console.log('Received Message:', message.utf8Data);
    const [messageType, player, messageText] = getMessage(message.utf8Data);

    if (Object.values.length <= 2 && messageType === MESSAGE.PLAYER) {
      players[player] = new Player(
        connection,
        {
          name: player,
          ready: false,
        },
      );
      updateBothClients(player);
    }

    if (messageType === MESSAGE.MOVE) {
      const moves = JSON.parse(messageText);
      players[player].units.forEach((unit, i) => unit.setData({ nextMove: moves[i] }));
      players[player].ready = true;
      if (getOtherPlayer(player).ready) {
        const enemyUnit = getOtherPlayer(player).units[0];
        const playerUnit = getThisPlayer(player).units[0];
        const enemyPreHealth = enemyUnit.health;
        const playerPreHealth = playerUnit.health;
        const enemyMove = enemyUnit.moves[enemyUnit.nextMove];
        const playerMove = playerUnit.moves[playerUnit.nextMove];
        enemyUnit.selfEffect();
        playerUnit.selfEffect();
        enemyUnit.clearStatusEffects();
        playerUnit.clearStatusEffects();
        enemyUnit.recieveEffect(playerMove);
        playerUnit.recieveEffect(enemyMove);
        if (enemyUnit.health <= 0) {
          getOtherPlayer(player).units.shift();
        }
        if (playerUnit.health <= 0) {
          getThisPlayer(player).units.shift();
          console.log('------------------------------');
        }
        const enemyLog = `${getOtherPlayer(player).name}:${enemyUnit.name}: ${enemyMove.name}, ${enemyUnit.health - enemyPreHealth}hp`;
        const playerLog = `${getThisPlayer(player).name}:${playerUnit.name}: ${playerMove.name}, ${playerUnit.health - playerPreHealth}hp`;
        updateBothClients(player, playerLog, enemyLog);
        Object.values(players).forEach((p) => { p.ready = false; });
      }
    }
  });
  connection.on('close', (reasonCode, description) => {
    console.log('Client has disconnected.');
  });
});