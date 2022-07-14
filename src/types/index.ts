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
  imageSrc?: string;
  description?: string;
};

export type ExerciseItem = {
  exercise: string;
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
  name: string;
  gender: string;
  birth: string;
  height: number;
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
