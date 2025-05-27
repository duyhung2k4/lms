import { ERROR_AUTH } from "@root/src/constants/error";
import { utils } from "@root/src/utils";
import { Router } from "express";
import type { Request, Response } from "express";

const authRouter = Router();

authRouter.route("/token")
  .get((req: Request, res: Response) => {
    try {
      const { token } = req.query
      if(!token) {
        throw ERROR_AUTH.TOKEN_NOT_FOUND
      }
      const result = utils.jwtMethod.verifyToken(token.toString());
      res.status(200).json({ result });
    } catch (error) {
      res.status(502).json({ error });
    }
  })
  .post((req: Request, res: Response) => {
    const payload = req.body;
    const token = utils.jwtMethod.createToken(payload);
    res.status(200).json({ token });
  })

authRouter
  .post("/password/hash", (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if(!password) {
        throw "password not found!";
      }
      const result = utils.password.hash(password);
      res.status(200).json({ result });
    } catch (error) {
      res.status(502).json({ error });
    }
  })
  .post("/password/compare", (req: Request, res: Response) => {
    try {
      const { password, hassPassword } = req.body;
      const isOk = utils.password.compare(password, hassPassword);
      res.status(200).json({ isOk });
    } catch (error) {
      res.status(502).json({ error });
    }
  })

export default authRouter;