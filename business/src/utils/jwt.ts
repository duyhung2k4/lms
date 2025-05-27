import fs from "fs";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { rootDir } from "..";
import { PATH_KEYS } from "../constants/path";

const createToken = (payload: Record<any, any>): string => {
  try {
    const pathCert = `${rootDir}/${PATH_KEYS.JWT_PRIVATE}`;
    const cert = fs.readFileSync(pathCert);
    const token = sign(
      payload,
      cert,
      {
        algorithm: "RS256",
        expiresIn: 60,
      },
    );
    return token;
  } catch (error) {
    throw error
  }
}

const verifyToken = <T>(token: string): T => {
  try {
    const pathCert = `${rootDir}/${PATH_KEYS.JWT_PUBLIC}`;
    const cert = fs.readFileSync(pathCert);
    const result = verify(token, cert, { algorithms: ["RS256"] });
    return result as T;
  } catch (error) {
    throw error;
  }
}

export const jwtMethod = {
  createToken,
  verifyToken,
}