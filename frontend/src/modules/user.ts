import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
  SerializedError,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import * as api from 'lib/api';
import {
  CompleteItem,
  ExerciseItem,
  ProgressPayload,
  Routine,
  User,
} from 'types';

type UserStateType = {
  loading: boolean;
  error: SerializedError | null;
  authErrorCode: number;
  user: User;
};

const initialUser: User = {
  username: '',
  nickname: '',
  snsProvider: '',
  profileImage: '',
  intro: '',
  currentRoutineId: '',
  completes: [],
  progress: [
    {
      id: 'weight',
      data: [],
    },
    {
      id: 'muscleMass',
      data: [],
    },
    {
      id: 'fatMass',
      data: [],
    },
  ],
  routines: [],
};

const initialState: UserStateType = {
  loading: false,
  error: null,
  authErrorCode: 0,
  user: initialUser,
};

export const register = createAsyncThunk(
  'REGISTER',
  async (
    payload: {
      username: string;
      password: string;
      nickname: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { username, password, nickname } = payload;
      const response = await api.register(username, password, nickname);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.status);
      }
      return e;
    }
  },
);

export const login = createAsyncThunk(
  'LOGIN',
  async (
    payload: {
      username: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { username, password } = payload;
      const response = await api.login(username, password);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.status);
      }
      return e;
    }
  },
);

export const logout = createAsyncThunk('LOGOUT', async () => {
  await api.logout();
});

export const deregister = createAsyncThunk(
  'DEREGISTER',
  async (payload: { username: string }) => {
    await api.deregister(payload.username);
  },
);

export const kakaoLogin = createAsyncThunk(
  'KAKAO_LOGIN',
  async (payload: { code: string }) => {
    const response = await api.kakaoLogin(payload.code);
    return response.data;
  },
);

export const kakaoLogout = createAsyncThunk('KAKAO_LOGOUT', async () => {
  await api.kakaoLogout();
});

export const kakaoDeregister = createAsyncThunk(
  'KAKAO_DEREGISTER',
  async () => {
    await api.kakaoDeregister();
  },
);

export const setInfo = createAsyncThunk(
  'SET_INFO',
  async (payload: { username: string; nickname: string; intro: string }) => {
    const { username, nickname, intro } = payload;
    await api.setInfo(username, nickname, intro);
    return { nickname, intro };
  },
);

export const setCurrentRoutine = createAsyncThunk(
  'SET_CURRENT_ROUTINE',
  async (payload: { username: string; routineId: string }) => {
    const { username, routineId } = payload;
    await api.setCurrentRoutine(username, routineId);
    return routineId;
  },
);

export const setProfileImage = createAsyncThunk(
  'SET_PROFILE_IMAGE',
  async (payload: { username: string; image: FormData | null }) => {
    const { username, image } = payload;
    if (image) {
      const response = await api.uploadProfileImage(image);
      await api.setProfileImageSrc(username, response.data.url);
      return response.data.url;
    }
    await api.setProfileImageSrc(username, '');
    return '';
  },
);

export const addComplete = createAsyncThunk(
  'ADD_COMPLETE',
  async (payload: { username: string; complete: CompleteItem }) => {
    const { username, complete } = payload;
    await api.addComplete(username, complete);
    return complete;
  },
);

export const removeComplete = createAsyncThunk(
  'REMOVE_COMPLETE',
  async (payload: { username: string; date: string }) => {
    const { username, date } = payload;
    await api.removeProgress(username, date);
    return date;
  },
);

export const addProgress = createAsyncThunk(
  'ADD_PROGRESS',
  async (payload: { username: string; progress: ProgressPayload }) => {
    const { username, progress } = payload;
    await api.addProgress(username, [
      { x: progress.date, y: progress.weight },
      { x: progress.date, y: progress.muscleMass },
      { x: progress.date, y: progress.fatMass },
    ]);
    return progress;
  },
);

export const removeProgress = createAsyncThunk(
  'REMOVE_PROGRESS',
  async (payload: { username: string; date: string }) => {
    const { username, date } = payload;
    await api.removeProgress(username, date);
    return date;
  },
);

export const addRoutine = createAsyncThunk(
  'ADD_ROUTINE',
  async (payload: { username: string; routineId: string }) => {
    const { username, routineId } = payload;
    const routine: Routine = {
      routineId,
      title: '새 루틴',
      lastModified: Date.now(),
      weekRoutine: [[], [], [], [], [], [], []],
    };
    await api.addRoutine(username, routine);
    return routine;
  },
);

export const removeRoutine = createAsyncThunk(
  'REMOVE_ROUTINE',
  async (payload: { username: string; routineId: string }) => {
    const { username, routineId } = payload;
    await api.removeRoutine(username, routineId);
    return routineId;
  },
);

export const editRoutine = createAsyncThunk(
  'EDIT_ROUTINE',
  async (payload: { username: string; routine: Routine }) => {
    const { username, routine } = payload;
    await api.editRoutine(username, routine);
    return routine.routineId;
  },
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    initializeUser: () => initialState,
    changeRoutineTitle: (
      state,
      action: PayloadAction<{ routineId: string; value: string }>,
    ) => {
      const { routineId, value } = action.payload;
      const routine = state.user.routines.find(
        (routine) => routine.routineId === routineId,
      );
      if (!routine) return;

      routine.title = value;
    },
    addRoutine: (state, action: PayloadAction<{ routine: Routine }>) => {
      state.user.routines.push(action.payload.routine);
    },
    addExercise: (
      state,
      action: PayloadAction<{
        routineId: string;
        dayIdx: number;
        exercise: ExerciseItem;
      }>,
    ) => {
      const { routineId, dayIdx, exercise } = action.payload;
      const routine = state.user.routines.find(
        (s) => s.routineId === routineId,
      );
      if (!routine) return;
      const dayRoutine = routine.weekRoutine[dayIdx];
      if (!dayRoutine) return;

      routine.weekRoutine[dayIdx] = [...dayRoutine, exercise];
      routine.lastModified = Date.now();
    },
    removeExercise: (
      state,
      action: PayloadAction<{
        routineId: string;
        dayIdx: number;
        exerciseIdx: number;
      }>,
    ) => {
      const { routineId, dayIdx, exerciseIdx } = action.payload;
      const routine = state.user.routines.find(
        (s) => s.routineId === routineId,
      );
      if (!routine) return;
      const dayRoutine = routine.weekRoutine[dayIdx];
      if (!dayRoutine) return;

      routine.weekRoutine[dayIdx] = dayRoutine.filter(
        (_, i) => i !== exerciseIdx,
      );
      routine.lastModified = Date.now();
    },
    insertExercise: (
      state,
      action: PayloadAction<{
        routineId: string;
        dayIdx: number;
        fromIdx: number;
        toIdx: number;
      }>,
    ) => {
      const { routineId, dayIdx, fromIdx, toIdx } = action.payload;
      const routine = state.user.routines.find(
        (s) => s.routineId === routineId,
      );
      if (!routine) return;
      const dayRoutine = routine.weekRoutine[dayIdx];
      if (!dayRoutine) return;

      const filtered = dayRoutine.filter((_, i) => i !== fromIdx);
      routine.weekRoutine[dayIdx] = [
        ...filtered.slice(0, toIdx),
        dayRoutine[fromIdx],
        ...filtered.slice(toIdx),
      ];
      routine.lastModified = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.user = initialUser;
        state.authErrorCode = action.payload as number;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = initialUser;
        state.authErrorCode = action.payload as number;
      })
      .addCase(kakaoLogin.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(kakaoLogin.rejected, (state) => {
        state.user = initialUser;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(setInfo.fulfilled, (state, action) => {
        state.user.nickname = action.payload.nickname;
        state.user.intro = action.payload.intro;
      })
      .addCase(setCurrentRoutine.fulfilled, (state, action) => {
        state.user.currentRoutineId = action.payload;
      })
      .addCase(setProfileImage.fulfilled, (state, action) => {
        state.user.profileImage = action.payload;
      })
      .addCase(addComplete.fulfilled, (state, action) => {
        if (state.user) {
          state.user.completes.push(action.payload);
        }
      })
      .addCase(removeComplete.fulfilled, (state, action) => {
        state.user.completes = state.user.completes.filter(
          (item) => item.date !== action.payload,
        );
      })
      .addCase(addProgress.fulfilled, (state, action) => {
        state.user.progress.map((item) =>
          item.data.push({
            x: action.payload.date,
            y: action.payload[item.id],
          }),
        );
      })
      .addCase(removeProgress.fulfilled, (state, action) => {
        state.user.progress.forEach((item) => {
          item.data = item.data.filter((i) => i.x !== action.payload);
        });
      })
      .addCase(addRoutine.fulfilled, (state, action) => {
        state.user.routines.push(action.payload);
      })
      .addCase(removeRoutine.fulfilled, (state, action) => {
        state.user.routines = state.user.routines.filter(
          (routine) => routine.routineId !== action.payload,
        );
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.authErrorCode = 0;
        state.error = null;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const {
  initializeUser,
  changeRoutineTitle,
  addExercise,
  removeExercise,
  insertExercise,
} = userSlice.actions;

export default userSlice.reducer;
