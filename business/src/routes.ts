import baseRouter from "./api/base";
import type { Express } from "express";

const initRouter = (app: Express) => {
  app.use("/api/base", baseRouter);
}

export default initRouter;