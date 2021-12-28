import { Unit } from './unit.js';

export class Archer extends Unit {
  constructor(tier) {
    const moves = {
      DRAW: {
        damage: 0,
        name: 'Draw',
        draw: true,
        blockable: true,
        position: [0, 1, 2],
      },
      SHOOT: {
        damage: [4,5,6,8][tier],
        name: 'Shoot',
        position: [0, 1, 2],
        shoot: true,
      },
      KICK: {
        damage: [2, 2, 3, 4][tier],
        name: 'Kick',
        position: [0],
      },
      DODGE: {
        damage: 0,
        name: 'Dodge',
        position: [0],
        dodge: true,
      },
      REST: {
        damage: 0,
        heal: [1,1,1,2][tier],
        name: 'Rest',
        position: [0, 1, 2],
      },
    };
    super({
      name: 'Archer', health: [8,9,11,14][tier], nextMove: null, stunned: false, blocked: false, moves, tier,
    });
  }

  getData() {
    return {
      name: this.name,
      health: this.health,
      maxHealth: this.maxHealth,
      nextMove: this.nextMove,
      stunned: this.stunned,
      blocked: this.blocked,
      moves: this.moves,
      canShoot: this.canShoot,
      tier: this.tier,
    };
  }

  setData({
    health, nextMove, stunned, blocked,
  }) {
    this.health = health || this.health;
    this.nextMove = nextMove || this.nextMove;
    this.stunned = stunned || this.stunned;
    this.blocked = blocked || this.blocked;
  }

  clearStatusEffects() {
    this.stunned = false;
    this.blocked = false;
  }

  selfEffect() {
    if (this.moves[this.nextMove].heal && this.health < this.maxHealth) {
      this.health += this.moves[this.nextMove].heal;
    }
    if (this.moves[this.nextMove].draw) {
      this.canShoot = true;
    }
  }
}
