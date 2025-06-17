import type { BaseModel } from "./base";
import type { DepartmentModel } from "./department";
import type { SectionClassModel } from "./section_classes";

export type SubjectModel = BaseModel & {
  name: string
  code: string
  description?: string
  number_of_credit: number
  number_of_lessons: number
  unit: number
  department_id: number

  department?: DepartmentModel
  section_class?: SectionClassModel[]
}