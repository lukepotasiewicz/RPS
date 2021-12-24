import React from 'react';
import './player.css';
import { IMAGE } from '../consts';

export const Unit = ({
  name, health, maxHealth, stunned, blocked, cantRiposte, cantDodge,
  nextMove, isEnemy, setMove, moves, position, tier,
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
        {Object.keys(moves || {}).map((moveKey) => (
          <button
            type="button"
            className={`actionButton ${moveKey === nextMove ? 'selected' : ''}`}
            disabled={
              (moves[moveKey].blockable && blocked)
              || stunned
              || !moves[moveKey].position.includes(position)
              || (moves[moveKey].riposte && cantRiposte)
              || (moves[moveKey].dodge && cantDodge)
            }
            onClick={() => setMove(moveKey)}
          >
            {moves[moveKey].name}
          </button>
        ))}
      </div>
    )}
  </div>
);
