import { Router } from "express";
import { baseFilterController } from "./controller";

const baseRouter = Router();

baseRouter.get("/filter",baseFilterController.handleFilter)
baseRouter.post("/query",baseFilterController.handleQuery)

export default baseRouter;