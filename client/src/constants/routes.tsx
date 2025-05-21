import {
  IconBuilding,
  IconCertificate,
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
    name: "Quản lí giáo viên",
    icon: IconUserSquare,
  },
  MANAGER_DEPARTMENT: {
    href: "/manager-department",
    name: "Quản lí khoa",
    icon: IconBuilding,
  },
  MANAGER_CENTIFICATE: {
    href: "/manager-centificate",
    name: "Quản lí chứng chỉ",
    icon: IconCertificate,
  }
}