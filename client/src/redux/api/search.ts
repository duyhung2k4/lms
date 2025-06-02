import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./base/query";
import { endpoint } from "./base/endpoint";
import type { BaseResponse } from "@/dto/base";
import type { SearchCollectionResponse } from "@/dto/response/searchResponse";

export const searchApi = createApi({
    baseQuery: axiosBaseQuery({ baseUrl: import.meta.env.VITE_SEARCH_URL }),
    reducerPath: "searchApi",
    endpoints: (builder) => ({
        search: builder.query<BaseResponse<SearchCollectionResponse>, { q: string }>({
            query: (payload) => ({
                ...(endpoint.search.searchCollection),
                params: payload,
            }),
        }),
    }),
});

export const {
    useSearchQuery,
} = searchApi