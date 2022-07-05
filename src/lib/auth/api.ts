import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = '/api';

export const register = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => client.post('/auth/register', { username, password });

export const login = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => client.post('/auth/login', { username, password });

export const check = () => client.get('/auth/check');
