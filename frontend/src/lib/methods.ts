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

export const getFirstDay = (date: Date) => {
  const d = new Date(date);
  d.setDate(1);
  return d.getDay();
};

export const getLastDayOfLastMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

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
