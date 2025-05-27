import { FILTER_TYPE, QUERY_ACTION } from "../constants/query"
import { Prisma } from "../generated/prisma"

export type BaseResponse = {
  data?: any
  error?: any
  status: number
  message: string
}

export type BaseFilterRequest = {
  modelName: Prisma.ModelName
  conditions: Record<any, any>
  type: FILTER_TYPE
  include?: Record<any, any>
  omit?: Record<any, any>
};

export type BaseQueryRequest = {
  action: QUERY_ACTION
  type: FILTER_TYPE
  modelName: Prisma.ModelName
  data: any
  include?: Record<any, any>
  omit?: Record<any, any>
}

export type BaseQueryAnyRequest = {
  action: QUERY_ACTION
  type: FILTER_TYPE
  modelName: Prisma.ModelName,
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