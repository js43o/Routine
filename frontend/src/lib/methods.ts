import { CompleteItem } from 'types';

export const dayidxToDaystr = (n: number) =>
  n >= 0 && n < 7 ? ['일', '월', '화', '수', '목', '금', '토'][n] : 'undefined';

export const datestrToDayidx = (str: string) => {
  const d = new Date(str);
  return d.getDay();
};

export const getDatestr = (date: Date) =>
  `${date.getFullYear()}-${
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  }-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`;

export const getKorProgress = (str: string) => {
  if (/weight/.test(str)) return '체중';
  if (/muscleMass/.test(str)) return '골격근량';
  if (/fatMass/.test(str)) return '체지방량';
  return '';
};

export const getWeekDate = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  const result = [d];

  while (result.length < 7) {
    const a = new Date(d);
    a.setDate(a.getDate() + result.length);
    result.push(a);
  }

  return result;
};

export const getFirstDayIdx = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  return d.getDay();
};

export const getLastDateOfLastMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export const getCalendarDateWithRecords = (
  currentDate: Date,
  completes: CompleteItem[],
) => {
  const frontDummy: number[] = [];
  const records: CompleteItem[] = [];
  const rearDummy: number[] = [];

  const tempDate = new Date(currentDate);
  tempDate.setDate(1);

  const FIRST_DAY_IDX = getFirstDayIdx(currentDate);
  const LAST_DATE = getLastDateOfLastMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  [...Array(FIRST_DAY_IDX)].forEach((_, idx) =>
    frontDummy.push(LAST_DATE - FIRST_DAY_IDX + (idx + 1)),
  );

  while (tempDate.getMonth() === currentDate.getMonth()) {
    const complete = completes.find((c) => c.date === getDatestr(tempDate));
    records.push({
      date: getDatestr(tempDate),
      routineName: complete?.routineName || '',
      exerciseList: complete?.exerciseList || [],
      memo: complete?.memo || '',
    });
    tempDate.setDate(tempDate.getDate() + 1);
  }

  const BLOCK_NUMBER = FIRST_DAY_IDX + records.length <= 35 ? 35 : 42;
  const REAR_NUMBER = Math.max(
    BLOCK_NUMBER - (FIRST_DAY_IDX + records.length),
    0,
  );
  [...Array(REAR_NUMBER)].forEach((_, idx) => rearDummy.push(idx + 1));

  return { frontDummy, records, rearDummy };
};

export const hideScroll = () => {
  let offset = document.body.offsetWidth;
  document.body.style.overflowY = 'hidden';
  offset -= document.body.offsetWidth;
  document.body.style.paddingRight = `${-offset}px`;
};

export const unhideScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

export const getAuthErrorCodeMessage = (code: number) => {
  switch (code) {
    case 400:
      return '잘못된 입력입니다.';
    case 401:
      return '로그인 정보가 일치하지 않습니다.';
    case 404:
      return '존재하지 않는 회원입니다.';
    case 409:
      return '이미 해당 아이디가 존재합니다.';
    case 500:
      return '서버의 응답이 없습니다.';
    default:
      return '잠시 후 다시 시도해주세요.';
  }
};
