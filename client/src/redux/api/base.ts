import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./base/query";
import { endpoint } from "./base/endpoint";
import type { BaseQueryAnyRequest, BaseResponse } from "@/dto/base";

export const baseApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: "baseApi",
  endpoints: (build) => ({
    query: build.mutation<BaseResponse<any>, BaseQueryAnyRequest>({
      query: (payload) => ({
        ...(endpoint.base.query),
        data: payload,
      })
    }),
    filter: build.query<BaseResponse<any>, BaseQueryAnyRequest>({
      query: (payload) => ({
        ...(endpoint.base.filter),
        params: {
          query: encodeURIComponent(JSON.stringify(payload)),
        }
      })
    }),
  })
});

export const {
  useFilterQuery,
  useQueryMutation,
} = baseApi;