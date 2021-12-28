import React, { useEffect, useState } from 'react';
import { PAGES } from '../consts';
import { Header } from '../header';
import {
  getMatches, joinMatch, makeMatch,
} from '../utils/api';
import { USER } from '../utils/cookies';
import './matchmaking.css';

export const Matchmaking = () => {
  const [matches, setMatches] = useState();

  const promiseMatchesData = (res) => {
    console.log(res);
    if (res.data?.matches) {
      setMatches(res.data?.matches);
    }
  };

  useEffect(() => {
    if (USER.username) {
      getMatches(USER.username).then(promiseMatchesData);
    }
  }, []);

  return (
    <>
      <Header selected={PAGES.PLAY} />
      <div className="pageWrapper matchmaking">
        <h2>Matches:</h2>
        <button
          type="button"
          onClick={() => makeMatch(USER.username).then(() => {
            window.location.href = PAGES.GAME;
          })}
        >
          Make Match
        </button>
        {matches
          ? (
            <div className="matches">
              {Object.keys(matches || {}).map((key) => (
                <div className="match">
                  {matches[key].name}
                  <button
                    type="button"
                    onClick={() => joinMatch(matches[key].name).then(() => {
                      window.location.href = `${PAGES.GAME}?match=${matches[key].name}`;
                    })}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )
          : ''}
      </div>
    </>
  );
};
