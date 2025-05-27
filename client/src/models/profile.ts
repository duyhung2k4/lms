import type { BaseModel } from "./base";
import type { DepartmentModel } from "./department";
import type { UserModel } from "./user";

export type ProfileModel = BaseModel & {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  lms_code: string;
  user?: UserModel;
  departments: DepartmentModel[];
  // centificates: Centificate[];
  // slot_section_classes: SlotSectionClass[];
  profile_departments: ProfileDepartmentModel[];
};

export type ProfileDepartmentModel = BaseModel & {
  profile_id: number;
  department_id: number;
  profile?: ProfileModel;
  department?: DepartmentModel;
};