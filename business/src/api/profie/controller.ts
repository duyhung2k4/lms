import { BaseResponse } from "@root/src/dto/base";
import { CreateProfileTeacherRequest } from "@root/src/dto/request/profile";
import { Request, Response } from "express";
import { profileService } from "./service";

const createProfileTeacher = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateProfileTeacherRequest;
    await profileService.handleCreateAccountTeacher(payload);
    const result: BaseResponse = {
      data: null,
      error: null,
      status: 200,
      message: "done",
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(502).json({
      data: null,
      error: `${error}`,
      status: 502,
      message: "handle error!",
    } as BaseResponse);
  }
}

export const profileController = {
  createProfileTeacher,
}