import axios from 'axios';

const apiBase = 'http://localhost:8080/api';

export const postLogin = (username) => axios.post(`${apiBase}/login`, { username });

export const getUser = (username) => axios.get(`${apiBase}/user?username=${username}`);

export const getOpenLootbox = (username) => axios.get(`${apiBase}/openLootbox?username=${username}`);

export const buyLootbox = (username) => axios.post(`${apiBase}/buyLootbox`, { username });

export const sellUnit = (username, unitId) => axios.post(`${apiBase}/sellUnit`, { username, unitId });

export const addToLineup = (username, unitId) => axios.post(`${apiBase}/addToLineup`, { username, unitId });

export const removeFromLineup = (username, unitId) => axios.post(`${apiBase}/removeFromLineup`, { username, unitId });

export const getMatches = (username) => axios.get(`${apiBase}/matches?username=${username}`);

export const makeMatch = (username) => axios.post(`${apiBase}/makeMatch`, { username });

export const joinMatch = (match) => axios.post(`${apiBase}/joinMatch`, { match });
