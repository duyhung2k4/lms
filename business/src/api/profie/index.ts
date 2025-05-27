import { Router } from "express";
import { profileController } from "./controller";

const profileRouter = Router();

profileRouter.route("/account-teacher")
  .post(profileController.createProfileTeacher)

export default profileRouter;