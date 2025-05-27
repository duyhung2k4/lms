import type { BaseModel } from "./base";
import type { ProfileModel } from "./profile";
import type { SemesterModel } from "./semester";
import type { SubjectModel } from "./subject";

export type SectionClassModel = BaseModel & {
  name: string
  code: string
  description?: string
  start_time?: Date
  end_time?: Date
  subject_id: number
  semester_id: number
  teacher_id?: number

  subject?: SubjectModel
  semester?: SemesterModel
  teacher?: ProfileModel
  slot_section_classes?: SlotSectionClassModel[]
}

export type SlotSectionClassModel = BaseModel & {
  code: string
  section_class_id: number
  register_id?: number
  section_class?: SectionClassModel
  register?: ProfileModel
  // centificate centificates?
}