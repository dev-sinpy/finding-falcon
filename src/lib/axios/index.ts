import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://findfalcone.herokuapp.com',
});

client.defaults.headers.common['Accept'] = 'application/json';
