import { BaseQueryAnyRequest } from "../dto/base";
import { utils } from "../utils";

export const preprocessingData = (payload: BaseQueryAnyRequest): BaseQueryAnyRequest => {
  switch (payload.modelName) {
    case "subjects":
      payload = preprocessingSubject(payload);
      break;
    default:
      break;
  }
  return payload;
}

const preprocessingSubject = (payload: BaseQueryAnyRequest): BaseQueryAnyRequest => {
  if (payload.action !== "create") return payload;
  switch (payload.type) {
    case "one":
      payload.data = {
        ...payload.data,
        code: utils.gen.genSubjectCode(),
      }
      break;
    case "many":
      payload.data = (payload.data as Record<any, any>[]).map(item => ({
        ...item,
        code: utils.gen.genSubjectCode(),
      }))
      break;
    default:
      break;
  }
  return payload;
}