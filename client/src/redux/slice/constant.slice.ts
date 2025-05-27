import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { DepartmentModel } from "@/models/department"

type State = {
  departments: DepartmentModel[]
}

const initialState: State = {
  departments: [],
}

export const constantSlice = createSlice({
  name: "constantSlice",
  initialState,
  reducers: {
    getAllDepartment(state, action: PayloadAction<DepartmentModel[]>) {
      state.departments = action.payload;
    },
  },
});

export const {
  getAllDepartment
} = constantSlice.actions;