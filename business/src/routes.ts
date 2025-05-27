import authRouter from "./api/auth";
import baseRouter from "./api/base";
import profileRouter from "./api/profie";
import type { Express } from "express";
import subjectRouter from "./api/subject";

const initRouter = (app: Express) => {
  app.use("/api/base", baseRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/subject", subjectRouter);
}

export default initRouter;