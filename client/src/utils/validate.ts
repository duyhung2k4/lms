import { z } from "zod";

const validateEmail = (value: string) => {
  const result = z.string().email("").safeParse(value);
  if(!result.success) "Email ko hợp lệ"
  return null;
}

const validateNull = (value: string) => {
  if(value.length === 0) "Không được để trống";
  return null;
}

export const validate = {
  validateEmail,
  validateNull,
}