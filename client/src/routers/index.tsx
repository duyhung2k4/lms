import React from "react";
import ManagerLayout from "@/components/layouts/manager";

import { Routes, Route } from "react-router";
import { ROUTER } from "@/constants/routes";
import {
  PageDashboard,
  PageManagerCentificate,
  PageManagerDepartment,
  PageManagerSemester,
  PageManagerSubject,
  PageManagerTeacher,
  PageSubjectDetail,
} from "./lazy";



const AppRouter: React.FC = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route element={<ManagerLayout />}>
          <Route path={ROUTER.BASE.href} element={<PageDashboard />} />
          <Route path={ROUTER.DASHBOARD.href} element={<PageDashboard />} />
          <Route path={ROUTER.MANAGER_DEPARTMENT.href} element={<PageManagerDepartment />} />
          <Route path={ROUTER.MANAGER_TEACHER.href} element={<PageManagerTeacher />} />
          <Route path={ROUTER.MANAGER_SUBJECT.href} element={<PageManagerSubject />} />
          <Route path={`${ROUTER.MANAGER_SUBJECT.href}/:code`} element={<PageSubjectDetail />} />
          <Route path={ROUTER.MANAGER_SEMESTER.href} element={<PageManagerSemester />} />
          <Route path={ROUTER.MANAGER_CENTIFICATE.href} element={<PageManagerCentificate />} />
        </Route>
      </Routes>
    </React.Fragment>
  )
}

export default AppRouter;