import { genSaltSync, compareSync, hashSync } from "bcrypt";

const SALT_ROUND = 14;

const hash = (password: string) => {
  try {
    const salt = genSaltSync(SALT_ROUND);
    const result = hashSync(password, salt);
    return result;
  } catch (error) {
    throw error;
  }
}

const compare = (password: string, hashPassword: string): boolean => {
  try {
    const isOk = compareSync(password, hashPassword);
    return isOk;
  } catch (error) {
    throw error;
  }
}

export const password = {
  hash,
  compare,
}