import { Unit } from './unit.js';

export class Dualist extends Unit {
  constructor(tier) {
    const moves = {
      ATTACK: {
        damage: [4, 5, 6, 8][tier],
        name: 'Attack',
        blockable: true,
        position: [0],
      },
      KICK: {
        damage: [2, 2, 3, 4][tier],
        name: 'Kick',
        position: [0],
      },
      RIPOSTE: {
        damage: 0,
        name: 'Riposte',
        position: [0],
        riposte: true,
      },
      DODGE: {
        damage: 0,
        name: 'Dodge',
        position: [0],
        dodge: true,
      },
      REST: {
        damage: 0,
        heal: [1, 1, 1, 2][tier],
        name: 'Rest',
        position: [0, 1, 2],
      },
    };
    super({
      name: 'Dualist', health: [10, 12, 14, 18][tier], nextMove: null, stunned: false, blocked: false, moves, tier,
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
      cantRiposte: this.cantRiposte,
      cantDodge: this.cantDodge,
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
    this.cantRiposte = false;
    this.cantDodge = false;
  }

  selfEffect() {
    if (this.moves[this.nextMove].heal && this.health < this.maxHealth) {
      this.health += this.moves[this.nextMove].heal;
    }
    if (this.moves[this.nextMove].dodge) {
      this.cantDodge = true;
    }
  }
}
