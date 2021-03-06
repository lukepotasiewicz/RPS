import { Unit } from './unit.js';

export class Knight extends Unit {
  constructor(tier) {
    const moves = {
      ATTACK: {
        damage: [4,5,6,8][tier],
        name: 'Attack',
        blockable: true,
        position: [0],
      },
      KICK: {
        damage: [2,3,3,4][tier],
        name: 'Kick',
        position: [0],
      },
      BLOCK: {
        damage: 0,
        block: true,
        name: 'Block',
        position: [0],
      },
      REST: {
        damage: 0,
        heal: [1,1,2,3][tier],
        name: 'Rest',
        position: [0, 1, 2],
      },
    };
    super({
      name: 'Knight', health: [12, 15, 19, 24][tier], nextMove: null, stunned: false, blocked: false, moves, tier,
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
  }
}
