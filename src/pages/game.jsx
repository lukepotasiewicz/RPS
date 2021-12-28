import React, { useState } from 'react';
import { MESSAGE, PAGES } from '../consts';
import './game.css';
import { Player } from '../components/player';
import { Header } from '../header';
import { USER } from '../utils/cookies';

const state = {
  setEnemyState: () => { },
  setPlayerState: () => { },
  setCanSubmit: () => { },
};
const gameLog = [];

const ws = new WebSocket('ws://localhost:9898/');
// const ws = new WebSocket('ws://73.47.47.101:9898/');

const getMessage = (message) => message.split('|');
const sendMessage = (type, match, player, value) => {
  ws.send(`${type}|${match}|${player}|${value}`);
};
window.globalSendMessage = sendMessage;

ws.onopen = function () {
  console.log('WebSocket Client Connected');
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  if (params.match) {
    USER.match = params.match;
  } else {
    USER.match = USER.username;
  }
  sendMessage(MESSAGE.PLAYER, USER.match, USER.username, '');
};

ws.onmessage = function (e) {
  const [messageType, messageText] = getMessage(e.data);
  if (messageType === MESSAGE.ENEMY) {
    state.setEnemyState({
      ...state.enemyState,
      name: messageText,
    });
  }
  if (messageType === MESSAGE.PLAYER) {
    state.setPlayerState({
      ...state.playerState,
      name: messageText,
    });
  }
  if (messageType === MESSAGE.TURN_END) {
    const { enemyState, playerState, log } = JSON.parse(messageText);
    console.log(playerState);
    console.log(enemyState);
    gameLog.push(log);
    state.setPlayerState({
      ...state.playerState,
      ...playerState,
    });
    state.setEnemyState({
      ...state.enemyState,
      ...enemyState,
    });
    state.setCanSubmit(true);
  }
};

export const Game = function () {
  const [playerState, setPlayerState] = useState({});
  state.setPlayerState = setPlayerState;
  const [enemyState, setEnemyState] = useState({});
  state.setEnemyState = setEnemyState;
  const [canSubmit, setCanSubmit] = useState(true);
  state.setCanSubmit = setCanSubmit;
  console.log(playerState);
  return (
    <>
      <Header selected={PAGES.GAME} />
      <div className="pageWrapper">
        <div className="App">
          <main>
            <Player {...playerState} canSubmit={canSubmit} setCanSubmit={setCanSubmit} />
            <Player {...enemyState} isEnemy />
            <div className="gameLog">
              {[].concat(gameLog).map((l, i) => {
                if (l) {
                  return <div>{`Turn ${i}: ${l}`}</div>;
                }
                return false;
              })}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
