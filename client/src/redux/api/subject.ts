import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./base/query";
import { endpoint } from "./base/endpoint";
import type { BaseResponse } from "@/dto/base";
import type { GenerateSectionClassRequest } from "@/dto/request/subject";
import type { SectionClassModel } from "@/models/section_classes";

export const subjectApi = createApi({
  baseQuery: axiosBaseQuery(),
  reducerPath: "subjectApi",
  endpoints: (build) => ({
    generateSectionClasses: build.mutation<BaseResponse<SectionClassModel[]>, GenerateSectionClassRequest>({
      query: (payload) => ({
        ...(endpoint.subject.generateSectionClasses),
        data: payload,
      })
    })
  }),
})

export const {
  useGenerateSectionClassesMutation,
} = subjectApi;