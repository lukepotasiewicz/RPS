import fs from 'fs';

export const readUserDB = () => JSON.parse(fs.readFileSync('users.json'));

export const writeUserDB = (data) => {
  const oldData = readUserDB();
  fs.writeFileSync('users.json', JSON.stringify({ ...oldData, ...data }));
};

export const readMatchesDB = () => JSON.parse(fs.readFileSync('matches.json'));

export const writeMatchesDB = (data) => {
  const oldData = readMatchesDB();
  fs.writeFileSync('matches.json', JSON.stringify({ ...oldData, ...data }));
};
