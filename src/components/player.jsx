import React, { useState } from 'react';
import { MESSAGE } from '../consts';
import './player.css';
import { Unit } from './unit';

export const Player = ({
  name, units, isEnemy, canSubmit, setCanSubmit,
}) => {
  const [moves, setMoves] = useState(['REST', 'REST']);
  const unitsArray = units?.map((unit, i) => (
    <Unit
      {...unit}
      isEnemy={isEnemy}
      setMove={(move) => {
        const m = [...moves];
        m[i] = move;
        setMoves(m);
      }}
      nextMove={moves[i]}
      position={i}
    />
  ));
  if (!isEnemy) {
    unitsArray?.reverse();
  }
  return (
    <div className={`half ${isEnemy ? 'enemy' : 'player'}`}>
      <h2>{`${isEnemy ? 'Enemy' : 'Player'}: ${name}`}</h2>
      <div className="units">
        {unitsArray}
      </div>
      {!isEnemy && (
        <>
          <button
            type="button"
            className="actionButton submit"
            disabled={!canSubmit}
            onClick={() => {
              console.log(`submitted ${moves}`);
              window.globalSendMessage(MESSAGE.MOVE, name, JSON.stringify(moves));
              setCanSubmit(false);
            }}
          >
            Submit
          </button>
          {!canSubmit && <p className="otherPlayer">Waiting for other player...</p>}
        </>
      )}
    </div>
  );
};
