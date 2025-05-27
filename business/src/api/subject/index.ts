import { Router } from "express";
import { subjectController } from "./controller";

const subjectRouter = Router();

subjectRouter.route("/")
  .post(subjectController.createSubject);

subjectRouter.post("/section-classes/generate", subjectController.generateSectionClass);

export default subjectRouter;