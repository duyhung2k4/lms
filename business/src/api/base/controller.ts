import { BaseQueryAnyRequest, BaseResponse } from "@root/src/dto/base";
import { utils } from "@root/src/utils";
import type { Request, Response } from "express";

const handleFilter = async (req: Request, res: Response) => {
  try {
    let query = req.body as BaseQueryAnyRequest;
    let queryFunc = null
    switch (query.type) {
      case "one":
        queryFunc = utils.baseQueryAny.getOne
        break;
      case "many":
        queryFunc = utils.baseQueryAny.getMany
        break;
      default:
        break;
    }

    if(!queryFunc) {
      throw "filter method not found!"
    }

    const data = await queryFunc(query);
    const result: BaseResponse = {
      data,
      error: undefined,
      status: 200,
      message: `${query.modelName}: filter success!`,
    }
    res.status(200).json(result);
    return;
  } catch (error) {
    res.status(502).json({
      data: null,
      error: error,
      status: 502,
      message: "handle error!",
    } as BaseResponse);
  }
}

const handleQuery = async (req: Request, res: Response) => {
  try {
    const query = req.body as BaseQueryAnyRequest;
    let queryFunc = null;
    switch (query.type) {
      case "one":
        switch (query.action) {
          case "create":
            queryFunc = utils.baseQueryAny.createOne
            break;
          case "update":
            queryFunc = utils.baseQueryAny.updateOne
            break;
          case "delete":
            queryFunc = utils.baseQueryAny.deleteOne
            break;
          default:
            break;
        }
        break;
      case "many":
        switch (query.action) {
          case "create":
            queryFunc = utils.baseQueryAny.createMany
            break;
          case "update":
            queryFunc = utils.baseQueryAny.updateMany
            break;
          case "delete":
            queryFunc = utils.baseQueryAny.deleteMany
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    if(!queryFunc) throw "not found action!";
    const data = await queryFunc(query);
    const result: BaseResponse = {
      data,
      error: undefined,
      status: 200,
      message: `${query.modelName}: query success!`,
    }
    res.status(200).json(result)
  } catch (error) {
    res.status(502).json({
      data: null,
      error: error,
      status: 502,
      message: "handle error!",
    } as BaseResponse);
  }
}

export const baseFilterController = {
  handleFilter,
  handleQuery,
}