import { lazy } from "react";

export const PageDashboard = lazy(() => import("@/components/pages/dashboard"));
export const PageManagerCentificate = lazy(() => import("@/components/pages/manager-centificate"));
export const PageManagerDepartment = lazy(() => import("@/components/pages/manager-department"));
export const PageManagerTeacher = lazy(() => import("@/components/pages/manager-teacher"));