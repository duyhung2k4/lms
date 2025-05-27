import type { BaseModel } from "./base";
import type { ProfileDepartmentModel } from "./profile";

export type DepartmentModel = BaseModel & {
  name: string
  code: string
  description?: string

  owner_id?: number
  owner?: any
  majors?: any[]
  profile_departments?: ProfileDepartmentModel[]
}