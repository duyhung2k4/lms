import { lazy } from "react";

export const PageDashboard = lazy(() => import("@/components/pages/dashboard"));
export const PageManagerCentificate = lazy(() => import("@/components/pages/manager-centificate"));
export const PageManagerDepartment = lazy(() => import("@/components/pages/manager-department"));
export const PageManagerTeacher = lazy(() => import("@/components/pages/manager-teacher"));
export const PageManagerSubject = lazy(() => import("@/components/pages/manager-subject"));
export const PageManagerSemester = lazy(() => import("@/components/pages/manager-semester"));
export const PageSubjectDetail = lazy(() => import("@/components/pages/subject-detail"));