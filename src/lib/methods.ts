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
  date.setDate(date.getDate() - date.getDay()); // this week, sunday
  date.setHours(0, 0, 0, 0);
  const result = [date];

  while (result.length < 7) {
    const a = new Date(date);
    a.setDate(a.getDate() + result.length);
    result.push(a);
  }

  return result;
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

export const validateAuth = (str: string, type: 'id' | 'pw') => {
  const idRegExp = /[A-Za-z\d_-]{5,20}/;
  const pwRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]){8,20}/;
  return type === 'id' ? idRegExp.test(str) : pwRegExp.test(str);
};
