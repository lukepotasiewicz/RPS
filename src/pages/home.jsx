import React from 'react';
import { PAGES } from '../consts';
import { Header } from '../header';

export const Home = () => (
  <>
    <Header selected={PAGES.HOME} />
    <div className="pageWrapper">
      HOME
    </div>
  </>
);
