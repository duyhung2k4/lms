import type { BaseModel } from "./base";
import type { ProfileModel } from "./profile";
import type { RoleUserModel } from "./role";

export type UserModel = BaseModel & {
  username: string;
  hash_assword: string;
  profile_id: number;
  profile?: ProfileModel;
  role_users: RoleUserModel[];
};