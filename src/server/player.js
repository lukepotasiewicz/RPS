import { UNIT } from './consts.js';
import { readUserDB } from './database.js';
import { Archer } from './units/archer.js';
import { Dualist } from './units/dualist.js';
import { Knight } from './units/knight.js';

export class Player {
  constructor(connection, { name, ready }) {
    this.name = name;
    this.ready = ready;
    this.connection = connection;
    const playerUnits = Object.values(readUserDB()[name]?.lineup || {});
    console.log(playerUnits);
    this.units = playerUnits.map((unit) => {
      const unitName = unit.name.toUpperCase();
      if (UNIT.KNIGHT === unitName) {
        return new Knight(unit.tier);
      } if (UNIT.DUALIST === unitName) {
        return new Dualist(unit.tier);
      } if (UNIT.ARCHER === unitName) {
        return new Archer(unit.tier);
      }
    });
  }

  getData() {
    return {
      name: this.name,
      units: this.units.map((unit) => unit.getData()),
    };
  }

  updateData({ units }) {
    this.units.forEach((unit, i) => unit.setData(units[i]));
  }
}
