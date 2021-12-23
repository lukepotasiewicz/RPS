export class Unit {
  constructor({
    name, health, nextMove, stunned, blocked, moves,
  }) {
    this.name = name;
    this.health = health;
    this.maxHealth = health;
    this.nextMove = nextMove;
    this.stunned = stunned;
    this.blocked = blocked;
    this.moves = moves;
  }

  getData() {
    return {
      name: this.name,
      health: this.health,
      maxHealth: this.maxHealth,
      nextMove: this.nextMove,
      stunned: this.stunned,
      blocked: this.blocked,
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

  recieveEffect(enemyMove) {
    const playerMove = this.moves[this.nextMove];
    if (playerMove.dodge) {
      this.cantDodge = true;
    } else if (playerMove.blockable && enemyMove.block) {
      this.blocked = true;
    } else if (playerMove.block && enemyMove.blockable) {
      // none
    } else if (playerMove.blockable && enemyMove.repost) {
      this.health -= playerMove.damage;
    } else if (playerMove.repost) {
      if (!enemyMove.blockable) {
        this.health -= enemyMove.damage;
        this.cantRepost = true;
      }
    } else {
      this.health -= enemyMove.damage;
    }
  }
}
