import fs from "fs";
import { sign } from "jsonwebtoken";
import { rootDir } from "..";
import { PATH_KEYS } from "../constants/path";

const createToken = (payload: Record<any, any>): string => {
  let cert = fs.readFileSync(`${rootDir}/${PATH_KEYS.JWT_PRIVATE}`);
  let token = sign(
    payload,
    cert,
    {
      algorithm: "RS256",
      expiresIn: 60,
    },
  );
  return token;
}

export const jwtMethod = {
  createToken,
}