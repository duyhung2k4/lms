import { configureStore } from '@reduxjs/toolkit'
import { baseApi, profileApi } from './api'
import { constantSlice } from './slice'
import { subjectApi } from './api/subject'
import { searchApi } from './api/search'

export const store = configureStore({
  reducer: {
    constant: constantSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [subjectApi.reducerPath]: subjectApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware,
      profileApi.middleware,
      subjectApi.middleware,
      searchApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch