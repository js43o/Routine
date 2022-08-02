import {
  createAsyncThunk,
  createSlice,
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

export const kakaoLogin = createAsyncThunk(
  'KAKAO_LOGIN',
  async ({ code }: { code: string }) => {
    const response = await api.kakaoLogin(code);
    return response.data;
  },
);

export const check = createAsyncThunk('CHECK', async () => {
  const reponse = await api.check();
  return reponse.data;
});

export const logout = createAsyncThunk('LOGOUT', async () => {
  const reponse = await api.logout();
  return reponse.data;
});

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

export const uploadProfileImage = createAsyncThunk(
  'SET_PROFILE_IMAGE',
  async ({ username, image }: { username: string; image: FormData }) => {
    const response = await api.uploadProfileImage(image);
    console.log('Data:', response.data);
    return response.data.url;
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
    initializeUser: (state, { payload }: { payload: User }) => {
      state.user = payload;
    },
    changeRoutineTitle: (
      state,
      {
        payload: { routineId, value },
      }: { payload: { routineId: string; value: string } },
    ) => {
      const { user } = state;
      const r = user.routines.find((s) => s.routineId === routineId);
      if (!r) return;
      r.title = value;
    },
    addRoutine: (state, { payload }: { payload: Routine }) => {
      const { user } = state;
      user.routines.push(payload);
    },
    addExercise: (
      state,
      {
        payload: { routineId, day, exercise },
      }: {
        payload: { routineId: string; day: number; exercise: ExerciseItem };
      },
    ) => {
      const { user } = state;
      const r = user.routines.find((s) => s.routineId === routineId);
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
      const { user } = state;
      const r = user.routines.find((s) => s.routineId === routineId);
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
      const { user } = state;
      const r = user.routines.find((s) => s.routineId === routineId);
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
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.user = initialUser;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.authErrorCode = 0;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.authErrorCode = action.payload as number;
      });
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.user = initialUser;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.authErrorCode = 0;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
        state.authErrorCode = action.payload as number;
      });
    builder
      .addCase(kakaoLogin.pending, (state) => {
        state.loading = true;
        state.user = initialUser;
      })
      .addCase(kakaoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.authErrorCode = 0;
        state.user = action.payload;
      })
      .addCase(kakaoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(check.pending, (state) => {
        state.loading = true;
      })
      .addCase(check.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(check.rejected, (state) => {
        state.loading = false;
        state.user = initialUser;
      });
    builder
      .addCase(setInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(setInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const { nickname, intro } = action.payload;
        state.user.nickname = nickname;
        state.user.intro = intro;
      })
      .addCase(setInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(setCurrentRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(setCurrentRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.currentRoutineId = action.payload;
      })
      .addCase(setCurrentRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.profileImage = action.payload;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(addComplete.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.user) {
          state.user.completes.push(action.payload);
        }
      })
      .addCase(addComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(removeComplete.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.completes = state.user.completes.filter(
          (item) => item.date !== action.payload,
        );
      })
      .addCase(removeComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(addProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.progress.map((item) =>
          item.data.push({
            x: action.payload.date,
            y: action.payload[item.id],
          }),
        );
      })
      .addCase(addProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(removeProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.progress.forEach((item) => {
          item.data = item.data.filter((i) => i.x !== action.payload);
        });
      })
      .addCase(removeProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(addRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.routines.push(action.payload);
      })
      .addCase(addRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(removeRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user.routines = state.user.routines.filter(
          (routine) => routine.routineId !== action.payload,
        );
      })
      .addCase(removeRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
    builder
      .addCase(editRoutine.pending, (state) => {
        state.loading = true;
      })
      .addCase(editRoutine.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editRoutine.rejected, (state, action) => {
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
