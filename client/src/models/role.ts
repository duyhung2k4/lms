import type { BaseModel } from "./base";
import type { UserModel } from "./user";

export type RoleModel = BaseModel & {
  name: string;
  code: string;
  // role_users: RoleUser[];
  // role_screens: RoleScreen[];
  // role_permissions: RolePermission[];
};

export type RoleUserModel = BaseModel & {
  role_id: number;
  user_id: number;
  role?: RoleModel;
  user?: UserModel;
};

export type RolePermissionModel = BaseModel & {
  role_id: number;
  permission_id: number;
  role?: RoleModel;
  // permission?: Permission;
};

export type RoleScreenModel = BaseModel & {
  role_id: number;
  screen_id: number;
  role?: RoleModel;
  // screen?: Screen;
};