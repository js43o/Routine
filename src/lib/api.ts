import axios from 'axios';
import { Routine } from 'modules/routine';
import { CompleteItem } from 'modules/user';

const client = axios.create();
client.defaults.baseURL = '/api';

export const register = (username: string, password: string) =>
  client.post('/auth/register', { username, password });

export const login = (username: string, password: string) =>
  client.post('/auth/login', { username, password });

export const check = () => client.get('/auth/check');

export const setInfo = (
  username: string,
  name: string,
  gender: string,
  birth: string,
  height: number,
) => client.post('/auth/set_info', { username, name, gender, birth, height });

export const setCurrentRoutine = (username: string, routineId: string) =>
  client.post('/auth/set_current_routine', { username, routineId });

export const addRoutine = (
  username: string,
  routineId: string,
  lastModified: string,
) => client.post('/routine/add', { username, routineId, lastModified });

export const editRoutine = (
  username: string,
  routineId: string,
  title: string,
  weekRoutine: Routine,
) => client.post('/routine/edit', { username, routineId, title, weekRoutine });

export const removeRoutine = (username: string, routineId: string) =>
  client.post('/routine/remove', { username, routineId });

export const addComplete = (username: string, complete: CompleteItem) =>
  client.post('/complete/add', { username, complete });

export const removeComplete = (username: string, completeDate: string) =>
  client.post('/complete/remove', { username, completeDate });

export const addProgress = (
  username: string,
  progress: { x: string; y: number }[],
) => client.post('/progress/add', { username, progress });

export const removeProgress = (username: string, progressDate: string) =>
  client.post('/progress/remove', { username, progressDate });

export default client;
