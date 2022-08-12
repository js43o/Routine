import axios from 'axios';
import { Routine, CompleteItem, Exercise } from 'types';

const client = axios.create();
client.defaults.baseURL = '/api';

export const register = (
  username: string,
  password: string,
  nickname: string,
) => client.post('/auth/register', { username, password, nickname });

export const login = (username: string, password: string) =>
  client.post('/auth/login', { username, password });

export const kakaoLogin = (code: string) =>
  client.post('/auth/kakao/login', { code });

export const kakaoLogout = () => client.post('/auth/kakao/logout');

export const kakaoDeregister = () => client.post('/auth/kakao/deregister');

export const check = () => client.get('/auth/check');

export const logout = () => client.post('/auth/logout');

export const deregister = (username: string) =>
  client.post('/auth/deregister', { username });

export const setInfo = (username: string, nickname: string, intro: string) =>
  client.post('/user/info', { username, nickname, intro });

export const setCurrentRoutine = (username: string, routineId: string) =>
  client.post('/user/curroutine', { username, routineId });

export const uploadProfileImage = (image: FormData) =>
  client.post('/user/image', image);

export const setProfileImageSrc = (username: string, src: string) =>
  client.post('/user/curimage', { username, src });

export const addRoutine = (username: string, routine: Routine) =>
  client.post('/routine/add', { username, routine });

export const editRoutine = (username: string, routine: Routine) =>
  client.post('/routine/edit', {
    username,
    routine,
  });

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

export const getExercises = () => {
  return client.get<Exercise[]>('/exercise');
};

export default client;
