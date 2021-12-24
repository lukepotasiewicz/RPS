export const UNIT_TABLE = {
  KNIGHT: {
    name: 'Knight',
    weight: 100,
    tiers: [50, 20, 5, 1],
    value: [1, 3, 8, 20],
  },
  DUALIST: {
    name: 'Dualist',
    weight: 100,
    tiers: [50, 20, 5, 1],
    value: [1, 3, 8, 20],
  },
  ARCHER: {
    name: 'Archer',
    weight: 50,
    tiers: [50, 20, 5, 1],
    value: [1, 5, 15, 30],
  },
};

const getRanIndexFromWeightArray = (weightArray) => {
  const totalWeight = weightArray.reduce((acc, w) => acc + w, 0);

  const random = Math.ceil(Math.random() * (totalWeight));
  let acc = 0;
  let pick = 0;
  for (let i = 0; i < weightArray.length; i += 1) {
    acc += weightArray[i];
    if (acc >= random) {
      pick = i;
      break;
    }
  }
  return pick;
};

export const generateUnit = () => {
  const unitChoice = Object.values(UNIT_TABLE)[getRanIndexFromWeightArray(
    Object.values(UNIT_TABLE).map((unit) => unit.weight),
  )];
  const tierChoice = getRanIndexFromWeightArray(unitChoice.tiers);
  return { name: unitChoice.name, tier: tierChoice, value: unitChoice.value[tierChoice] };
};
