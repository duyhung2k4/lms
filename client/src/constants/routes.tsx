import {
  IconAlignBoxLeftTop,
  IconBuilding,
  IconCertificate,
  IconColorPicker,
  IconLayoutDashboard,
  IconUserSquare,
  type Icon,
  type IconProps,
} from '@tabler/icons-react';

export type TypeInfoRoute = {
  href: string;
  name?: string;
  icon?: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
}

export type KeyRoute =
  | "BASE"
  | "DASHBOARD"
  | "MANAGER_TEACHER"
  | "MANAGER_DEPARTMENT"
  | "MANAGER_CENTIFICATE"
  | "MANAGER_SUBJECT"
  | "MANAGER_SEMESTER"

export const ROUTER: Record<KeyRoute, TypeInfoRoute> = {
  BASE: {
    href: "/",
  },
  DASHBOARD: {
    href: "/dashboard",
    name: "Thống kê",
    icon: IconLayoutDashboard,
  },
  MANAGER_TEACHER: {
    href: "/manager-teacher",
    name: "Quản lý giáo viên",
    icon: IconUserSquare,
  },
  MANAGER_DEPARTMENT: {
    href: "/manager-department",
    name: "Quản lý khoa",
    icon: IconBuilding,
  },
  MANAGER_CENTIFICATE: {
    href: "/manager-centificate",
    name: "Quản lý chứng chỉ",
    icon: IconCertificate,
  },
  MANAGER_SUBJECT: {
    href: "/manager-subject",
    name: "Quản lý môn học",
    icon: IconColorPicker,
  },
  MANAGER_SEMESTER: {
    href: "/manager-semester",
    name: "Quản lý kì học",
    icon: IconAlignBoxLeftTop,
  }
}