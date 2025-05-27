import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./base/query";
import { endpoint } from "./base/endpoint";
import type { BaseResponse } from "@/dto/base";
import type { CreateProfileTeacherRequest } from "@/dto/request/profile";

export const profileApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: "profileApi",
  endpoints: (build) => ({
    createTeacher: build.mutation<BaseResponse<null>, CreateProfileTeacherRequest>({
      query: (payload) => ({
        ...(endpoint.profile.createTeacher),
        data: payload,
      })
    })
  })
});

export const {
  useCreateTeacherMutation,
} = profileApi;