
import type { MODEL_NAME } from "@/constants/model"
import type { FILTER_TYPE, QUERY_ACTION } from "@/constants/query"

export type BaseResponse<T> = {
  data?: T
  error?: Error
  status: number
  message: string
}

export type BaseFilterRequest = {
  modelName: MODEL_NAME
  conditions: Record<any, any>
  type: FILTER_TYPE
  include?: Record<any, any>
  omit?: Record<any, any>
};

export type BaseQueryRequest = {
  action: QUERY_ACTION
  type: FILTER_TYPE
  modelName: MODEL_NAME
  data: any
  include?: Record<any, any>
  omit?: Record<any, any>
}

export type BaseQueryAnyRequest = {
  action: QUERY_ACTION
  type: FILTER_TYPE
  modelName: MODEL_NAME,
  conditions: Record<any, any>,
  data: any,
  include?: Record<any, any>,
  omit?: Record<any, any>,
  orderBy?: Record<any, any>,
  select?: Record<any, any>,
  take?: number,
  skip?: number,
  distinct?: string[]
}

export const BaseQueryAnyRequestDefaultFilter: BaseQueryAnyRequest = {
  action: "read",
  type: "many",
  conditions: {},
  modelName: "profiles",
  data: {},
}