import React from 'react';
import './player.css';
import { IMAGE } from '../consts';

export const Unit = ({
  name, health, maxHealth, stunned, blocked, cantRiposte, cantDodge,
  nextMove, isEnemy, setMove, moves, position, tier, canShoot,
}) => (
  <div className="unit">
    <h3>{name}</h3>
    <div className="imageContainer">
      <div className={`tierGlow tier-${tier}`} />
      {!isEnemy ? <img className="playerImage" alt="playerImage" src={IMAGE[name]} />
        : <img className="enemyImage" alt="enemyImage" src={IMAGE[name]} />}
    </div>
    <div className="healthBar">
      <div className="healthValue">{health}</div>
      <div className="healthBarTop" style={{ width: `${(health / maxHealth) * 100}%` }} />
    </div>
    {!isEnemy && (
      <div className="actionBar">
        {Object.keys(moves || {}).map((moveKey) => {
          const checkDisabled = (k) => (moves[k].blockable && blocked)
            || stunned
            || !moves[k].position.includes(position)
            // dualist
            || (moves[k].riposte && cantRiposte)
            || (moves[k].dodge && cantDodge)
            // archer
            || (moves[k].shoot && !canShoot)
            || (moves[k].draw && canShoot);

          const disabled = checkDisabled(moveKey);
          if ((disabled && moveKey === nextMove) || !Object.keys(moves || {}).includes(nextMove)) {
            setMove(Object.keys(moves || {}).find((key) => !checkDisabled(key)));
          }
          return (
            <button
              type="button"
              className={`actionButton ${moveKey === nextMove ? 'selected' : ''}`}
              disabled={disabled}
              onClick={() => setMove(moveKey)}
            >
              {moves[moveKey].name}
            </button>
          );
        })}
      </div>
    )}
  </div>
);
