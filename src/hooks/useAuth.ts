import { useDispatch } from 'react-redux';
import { UserPayload } from 'modules';
import { initializeRoutine } from 'modules/routine';
import {
  initializeCompleteDay,
  initializeProgress,
  setCurrentRoutine,
  setUserInfo,
} from 'modules/user';
import * as api from '../lib/auth/api';

const useAuth = () => {
  const dispatch = useDispatch();

  const register = async (username: string, password: string) => {
    const response = await api.register({ username, password });
    // eslint-disable-next-line no-console
    console.log(response.data);
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login({ username, password });
      // eslint-disable-next-line no-console
      console.log(response.data);

      const {
        name,
        gender,
        birth,
        height,
        currentRoutineId,
        routine,
        completes,
        progress,
      } = response.data as UserPayload;

      dispatch(
        setUserInfo({
          name,
          gender,
          birth,
          height,
        }),
      );
      dispatch(initializeRoutine(routine));

      const currentRoutine = routine.find(
        (item) => item.routineId === currentRoutineId,
      );
      dispatch(setCurrentRoutine(currentRoutine?.routineId || ''));
      dispatch(initializeCompleteDay(completes));
      dispatch(initializeProgress(progress));
    } catch (e) {
      console.error(e);
    }
  };

  return { register, login };
};

export default useAuth;
