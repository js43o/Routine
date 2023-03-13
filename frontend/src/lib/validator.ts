export const hasAlphabet = (str: string) => /[a-zA-Z]/.test(str);

export const hasNumber = (str: string) => /\d/.test(str);

export const hasSpecialCharacter = (str: string) => /[^\w\sㄱ-힣]/.test(str);

export const hasWhitespace = (str: string) => /\s/.test(str);

export const isRegularCharacter = (str: string) => /^[\wㄱ-힣]+$/.test(str);

export const validateUsername = (str: string) => {
  if (/^[a-z\d-_]+$/.test(str)) return true;
  return false;
};

export const validatePassword = (str: string) => {
  if (
    hasAlphabet(str) &&
    hasNumber(str) &&
    hasSpecialCharacter(str) &&
    !hasWhitespace(str)
  )
    return true;
  return false;
};

export const validateNickname = (str: string) => {
  if (isRegularCharacter(str)) return true;
  return false;
};
