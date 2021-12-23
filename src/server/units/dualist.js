import { Unit } from './unit.js';

export class Dualist extends Unit {
  constructor() {
    const moves = {
      ATTACK: {
        damage: 4,
        name: 'Attack',
        blockable: true,
        position: [0],
      },
      KICK: {
        damage: 2,
        name: 'Kick',
        position: [0],
      },
      REPOST: {
        damage: 0,
        name: 'Repost',
        position: [0],
        repost: true,
      },
      DODGE: {
        damage: 0,
        name: 'Dodge',
        position: [0],
        dodge: true,
      },
      REST: {
        damage: 0,
        heal: 1,
        name: 'Rest',
        position: [0, 1, 2],
      },
    };
    super({
      name: 'Dualist', health: 10, nextMove: null, stunned: false, blocked: false, moves,
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
      cantRepost: this.cantRepost,
      cantDodge: this.cantDodge,
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
    this.cantRepost = false;
    this.cantDodge = false;
  }

  selfEffect() {
    if (this.moves[this.nextMove].heal && this.health < this.maxHealth) {
      this.health += this.moves[this.nextMove].heal;
    }
  }
}
