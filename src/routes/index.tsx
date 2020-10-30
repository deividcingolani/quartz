import React, { FC } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

import routeNames from './routeNames';
// Layouts
import AppLayout from '../layouts/app/AppLayout';
import ProjectManagementLayout from '../layouts/project-management/ProjectManagementLayout';
// Pages
const Project = React.lazy(() => import('../pages/project/Project'));
const ProjectEdit = React.lazy(() => import('../pages/project/ProjectEdit'));
const ProjectCreate = React.lazy(
  () => import('../pages/project/ProjectCreate'),
);
const AllProjects = React.lazy(
  () => import('../pages/all-projects/AllProjects'),
);

const Routes: FC = () => {
  return (
    <RouterRoutes>
      <Route>
        {/* Project Management Routes */}
        <ProjectManagementLayout>
          <RouterRoutes>
            <Route path={routeNames.project.list} element={<AllProjects />} />
            <Route path={routeNames.project.edit} element={<ProjectEdit />} />
            <Route
              path={routeNames.project.create}
              element={<ProjectCreate />}
            />
          </RouterRoutes>
        </ProjectManagementLayout>
      </Route>

      <Route>
        {/* App Routes */}
        <AppLayout>
          <RouterRoutes>
            <Route path={routeNames.project.view} element={<Project />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </RouterRoutes>
        </AppLayout>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
