import React, { useEffect, useState } from 'react';
import { IMAGE, PAGES } from '../consts';
import { Header } from '../header';
import {
  addToLineup, buyLootbox, getOpenLootbox, getUser, removeFromLineup, sellUnit,
} from '../utils/api';
import { USER } from '../utils/cookies';
import coin from '../images/coin.png'
import './account.css';

export const Account = () => {
  const [user, setUser] = useState();
  const [selling, setSelling] = useState(false);

  const promiseUserData = (res) => {
    if (res.data?.user) {
      const userData = res.data?.user;
      const unitsArray = Object.keys(userData.units).map((key) => {
        userData.units[key].id = key;
        return userData.units[key];
      });
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
      <p className="value coin"><img src={coin} alt='' className="icon" />{unit.value}</p>
    </button>
  );

  return (
    <>
      <Header selected={PAGES.ACCOUNT} />
      {user
        ? (
          <div className={`pageWrapper account `}>
            <h2>{`Hello, ${USER.username}`}</h2>
            <p>{`Lootboxes: ${user.lootboxes}`}</p>
            <button
              type="button"
              onClick={() => {
                getOpenLootbox(USER.username).then(promiseUserData);
              }}
            >
              Open Lootbox
            </button>
            <button
              type="button"
              onClick={() => {
                buyLootbox(USER.username).then(promiseUserData);
              }}
            >
              Buy Lootbox
            </button>
            <p className="coin"><img src={coin} alt='' className="icon" />{user.coin}</p>
            <button
              type="button"
              onClick={() => {
                setSelling(!selling);
              }}
            >
              {!selling ? 'Sell Units' : 'Stop Selling'}
            </button>
            <h4>Units:</h4>
            <div className={`${Object.keys(user.lineup || {}).length >= 3 ? 'noHover' : ''} ${selling ? 'selling' : ''}`}>
              {user.units.map((unit) => unitPreview(
                unit,
                !selling ? () => addToLineup(USER.username, unit.id).then(promiseUserData)
                  : () => sellUnit(USER.username, unit.id).then(promiseUserData),
              ))}
            </div>
            <div className="lineup">
              <h3>{`Lineup: (${Object.keys(user.lineup || {}).length}/3)`}</h3>
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
