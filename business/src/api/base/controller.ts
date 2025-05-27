import { ERROR_BAD_REQUEST } from "@root/src/constants/error";
import { BaseQueryAnyRequest, BaseResponse } from "@root/src/dto/base";
import { preprocessingData } from "@root/src/middlewares";
import { utils } from "@root/src/utils";
import type { Request, Response } from "express";

const handleFilter = async (req: Request, res: Response) => {
  try {
    let { query } = req.query;
    if (!query) throw ERROR_BAD_REQUEST.QUERY_NOT_FOUND;
    if (typeof query !== "string") throw ERROR_BAD_REQUEST.TYPE_OF_QUERY_INVALID;

    const decoded = decodeURIComponent(query);
    const parsed = JSON.parse(decoded);
    const payload = parsed as BaseQueryAnyRequest;
    
    let queryFunc = null
    switch (payload.type) {
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

    const data = await queryFunc(payload);
    const result: BaseResponse = {
      data,
      error: undefined,
      status: 200,
      message: `${payload.modelName}: filter success!`,
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

const handleQuery = async (req: Request, res: Response) => {
  try {
    const query = preprocessingData(req.body as BaseQueryAnyRequest);
    let queryFunc = null;
    if (query.action === "read") throw "method invalid!";
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
          case "destroy":
            queryFunc = utils.baseQueryAny.destroyOne
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
          case "destroy":
            queryFunc = utils.baseQueryAny.destroyMany
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    if (!queryFunc) throw "not found action!";
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
      error: `${error}`,
      status: 502,
      message: "handle error!",
    } as BaseResponse);
  }
}

export const baseFilterController = {
  handleFilter,
  handleQuery,
}