export const regexp = {
  username: /^[A-Za-z\d_-]+$/,
  password:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*({[<>\]})-_=+;:'"\\|/?.,])[A-Za-z\d`~!@#$%^&*({[<>\]})-_=+;:'"\\|/?.,]+$/,
  nickname: /^[ㄱ-ㅎ가-힇A-Za-z\d]+$/,
};

export const targetKorName = {
  all: '전체',
  upper: '상체',
  lower: '하체',
  core: '코어',
};
