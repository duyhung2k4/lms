export type CreateSubjectRequest = {
  name: string
  description?: string
  number_of_credit: number
  number_of_lessons: number
  unit: number
  department_id: number
}

export type GenerateSectionClassRequest = {
  number_of_section_class: number
  number_of_student: number
  subject_id: number
  semester_id: number
}