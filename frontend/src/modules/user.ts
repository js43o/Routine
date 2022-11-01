import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
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
    {
      username,
      password,
      nickname,
    }: { username: string; password: string; nickname: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.register(username, password, nickname);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.status || '');
      }
      return e;
    }
  },
);

export const login = createAsyncThunk(
  'LOGIN',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.login(username, password);
      return response.data;
    } catch (e) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.status || '');
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
  async ({ username }: { username: string }) => {
    await api.deregister(username);
  },
);

export const kakaoLogin = createAsyncThunk(
  'KAKAO_LOGIN',
  async ({ code }: { code: string }) => {
    const response = await api.kakaoLogin(code);
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
  async ({
    username,
    nickname,
    intro,
  }: {
    username: string;
    nickname: string;
    intro: string;
  }) => {
    await api.setInfo(username, nickname, intro);
    return { nickname, intro };
  },
);

export const setCurrentRoutine = createAsyncThunk(
  'SET_CURRENT_ROUTINE',
  async ({ username, routineId }: { username: string; routineId: string }) => {
    await api.setCurrentRoutine(username, routineId);
    return routineId;
  },
);

export const setProfileImage = createAsyncThunk(
  'SET_PROFILE_IMAGE',
  async ({ username, image }: { username: string; image: FormData | null }) => {
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
  async ({
    username,
    complete,
  }: {
    username: string;
    complete: CompleteItem;
  }) => {
    await api.addComplete(username, complete);
    return complete;
  },
);

export const removeComplete = createAsyncThunk(
  'REMOVE_COMPLETE',
  async ({ username, date }: { username: string; date: string }) => {
    await api.removeProgress(username, date);
    return date;
  },
);

export const addProgress = createAsyncThunk(
  'ADD_PROGRESS',
  async ({
    username,
    progress,
  }: {
    username: string;
    progress: ProgressPayload;
  }) => {
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
  async ({ username, date }: { username: string; date: string }) => {
    await api.removeProgress(username, date);
    return date;
  },
);

export const addRoutine = createAsyncThunk(
  'ADD_ROUTINE',
  async ({ username, routineId }: { username: string; routineId: string }) => {
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
  async ({ username, routineId }: { username: string; routineId: string }) => {
    await api.removeRoutine(username, routineId);
    return routineId;
  },
);

export const editRoutine = createAsyncThunk(
  'EDIT_ROUTINE',
  async ({ username, routine }: { username: string; routine: Routine }) => {
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
      {
        payload: { routineId, value },
      }: { payload: { routineId: string; value: string } },
    ) => {
      const r = state.user.routines.find((s) => s.routineId === routineId);
      if (!r) return;
      r.title = value;
    },
    addRoutine: (state, { payload }: { payload: Routine }) => {
      state.user.routines.push(payload);
    },
    addExercise: (
      state,
      {
        payload: { routineId, day, exercise },
      }: {
        payload: { routineId: string; day: number; exercise: ExerciseItem };
      },
    ) => {
      const r = state.user.routines.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      r.weekRoutine[day] = [...d, exercise];
      r.lastModified = Date.now();
    },
    removeExercise: (
      state,
      {
        payload: { routineId, day, idx },
      }: { payload: { routineId: string; day: number; idx: number } },
    ) => {
      const r = state.user.routines.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      r.weekRoutine[day] = d.filter((_, i) => i !== idx);
      r.lastModified = Date.now();
    },
    insertExercise: (
      state,
      {
        payload: { routineId, day, fromIdx, toIdx },
      }: {
        payload: {
          routineId: string;
          day: number;
          fromIdx: number;
          toIdx: number;
        };
      },
    ) => {
      const r = state.user.routines.find((s) => s.routineId === routineId);
      if (!r) return;
      const d = r.weekRoutine[day];
      if (!d) return;
      const filtered = d.filter((_, i) => i !== fromIdx);
      r.weekRoutine[day] = [
        ...filtered.slice(0, toIdx),
        d[fromIdx],
        ...filtered.slice(toIdx),
      ];
      r.lastModified = Date.now();
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
