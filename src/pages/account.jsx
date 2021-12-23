import React, { useEffect, useState } from 'react';
import { IMAGE, PAGES } from '../consts';
import { Header } from '../header';
import {
  addToLineup, getOpenLootbox, getUser, removeFromLineup,
} from '../utils/api';
import { USER } from '../utils/cookies';
import './account.css';

export const Account = () => {
  const [user, setUser] = useState();

  const promiseUserData = (res) => {
    if (res.data?.user) {
      const userData = res.data?.user;
      const unitsArray = Object.keys(userData.units).map((key) => {
        userData.units[key].id = key;
        return userData.units[key];
      });
      console.log(unitsArray);
      unitsArray.sort((a, b) => ((a.tier > b.tier) ? -1 : 1));
      unitsArray.sort((a, b) => ((a.name > b.name) ? -1 : 1));
      console.log(unitsArray);
      userData.units = unitsArray;
      setUser(userData);
    }
  };

  useEffect(() => {
    if (USER.username) {
      getUser(USER.username).then(promiseUserData);
    }
  }, []);

  const unitPreview = (unit, onClick) => (
    <button type="button" className="unitPreview" onClick={onClick}>
      <p>{unit.name}</p>
      <div className={`tierGlow tier-${unit.tier}`} />
      <img className="unitThumbnail" alt="" src={IMAGE[unit.name]} />
    </button>
  );

  return (
    <>
      <Header selected={PAGES.ACCOUNT} />
      {user
        ? (
          <div className="pageWrapper account">
            <p>{`Hello, ${USER.username}`}</p>
            <p>{`Lootboxes: ${user.lootboxes}`}</p>
            <button
              type="button"
              onClick={() => {
                getOpenLootbox(USER.username).then(promiseUserData);
              }}
            >
              Open Lootbox
            </button>
            <p>Characters:</p>
            <div className={Object.keys(user.lineup || {}).length >= 3 ? 'noHover' : ''}>
              {user.units.map((unit) => unitPreview(
                unit,
                () => addToLineup(USER.username, unit.id).then(promiseUserData),
              ))}
            </div>
            <div className="lineup">
              <h3>Lineup:</h3>
              {Object.keys(user.lineup || {}).map((key) => unitPreview(
                user.lineup[key],
                () => removeFromLineup(USER.username, key).then(promiseUserData),
              ))}
            </div>
          </div>
        )
        : ''}
    </>
  );
};
