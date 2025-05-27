import { gen } from "./gen";
import { jwtMethod } from "./jwt";
import { password } from "./password";
import { baseQuery } from "./query/base";
import { baseQueryAny } from "./query/baseAny";

export const utils = {
  baseQuery,
  baseQueryAny,
  jwtMethod,
  password,
  gen,
}