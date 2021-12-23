import axios from 'axios';

const apiBase = 'http://localhost:8080/api';

export const postLogin = (username) => axios.post(`${apiBase}/login`, { username });

export const getUser = (username) => axios.get(`${apiBase}/user?username=${username}`);

export const getOpenLootbox = (username) => axios.get(`${apiBase}/open-lootbox?username=${username}`);

export const addToLineup = (username, unitId) => axios.post(`${apiBase}/addToLineup`, { username, unitId });

export const removeFromLineup = (username, unitId) => axios.post(`${apiBase}/removeFromLineup`, { username, unitId });

export const getMatches = (username) => axios.get(`${apiBase}/matches?username=${username}`);

export const makeMatch = (username) => axios.post(`${apiBase}/make-match`, { username });

export const joinMatch = (username) => axios.post(`${apiBase}/join-match`, { username });
