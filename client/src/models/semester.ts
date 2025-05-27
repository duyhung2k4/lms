import type { BaseModel } from "./base";

export type SemesterModel = BaseModel & {
  name: string
  description?: string
  start_time?: Date
  end_time?: Date
  school_year_id: number
}