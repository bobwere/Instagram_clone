import { compareSync, genSaltSync, getRounds, hashSync } from 'bcryptjs';

export const hash = (password: string): string => {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(password, salt);
  return hashedPassword;
};

export const compareHash = (string1: string, hashedString: string): boolean => {
  if (!string1 || !hashedString) return false;
  return compareSync(string1, hashedString);
};

export const isHashed = (string: string): boolean => {
  try {
    const roundRounds = getRounds(string);
    return roundRounds > 0;
  } catch (error) {
    return false;
  }
};
