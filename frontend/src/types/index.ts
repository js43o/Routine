export type CompleteItem = {
  date: string;
  list: ExerciseItem[];
  memo: string;
};

export type ProgressItem = {
  id: 'weight' | 'muscleMass' | 'fatMass';
  data: {
    x: string;
    y: number;
  }[];
};

export type ProgressPayload = {
  date: string;
  weight: number;
  muscleMass: number;
  fatMass: number;
};

export type Exercise = {
  name: string;
  category: string[];
  part: string[];
};

export type ExerciseItem = {
  name: string;
  weight: number;
  numberOfTimes: number;
  numberOfSets: number;
};

export type Routine = {
  routineId: string;
  title: string;
  lastModified: number;
  weekRoutine: [
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
    ExerciseItem[],
  ];
};

export type User = {
  username: string;
  nickname: string;
  snsProvider: string;
  profileImage: string;
  intro: string;
  currentRoutineId: string;
  completes: CompleteItem[];
  progress: ProgressItem[];
  routines: Routine[];
};

export type PerformItem = {
  exercise: ExerciseItem;
  setCheck: boolean[];
};

export type PerformList = {
  lastModified: number | null;
  list: PerformItem[];
};
