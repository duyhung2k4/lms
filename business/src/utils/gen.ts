import { customAlphabet } from "nanoid";
import { v6 as uuidv6 } from "uuid";

const genLmsCode = (): string => {
  const letterNano = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);
  const numberNano = customAlphabet("0123456789", 4);
  const randomCode = `${letterNano()}${numberNano()}`

  return `LMS-${randomCode}`;
}

const genSectionClassCode = (subjectCode: string): string => {
  const letterNano = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);
  const numberNano = customAlphabet("0123456789", 5);
  const randomCode = `${letterNano()}${numberNano()}`
  return `${subjectCode}-${randomCode}`;
}

const genSubjectCode = (): string => {
  const letterNano = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);
  return letterNano();
}

const genUuid = (): string => {
  return uuidv6().toString();
}

export const gen = {
  genLmsCode,
  genSectionClassCode,
  genSubjectCode,
  genUuid,
}