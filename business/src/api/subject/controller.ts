import { BaseResponse } from "@root/src/dto/base";
import { CreateSubjectRequest, GenerateSectionClassRequest } from "@root/src/dto/request/subject";
import { Request, Response } from "express";
import { subjectService } from "./service";

const createSubject = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreateSubjectRequest;
    const subject = await subjectService.handleCreateSubject(payload);
    const result: BaseResponse = {
      data: subject,
      error: null,
      status: 200,
      message: "success",
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

const generateSectionClass = async (req: Request, res: Response) => {
  try {
    const payload = req.body as GenerateSectionClassRequest;
    const sectionClasses = await subjectService.handleGenerateSectionClass(payload);
    const result: BaseResponse = {
      data: sectionClasses,
      error: null,
      status: 200,
      message: "success",
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

export const subjectController = {
  createSubject,
  generateSectionClass,
}