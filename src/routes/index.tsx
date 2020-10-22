import React, { FC } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

import routeNames from './routeNames';
// Layouts
import AppLayout from '../layouts/app/AppLayout';
import ProjectManagementLayout from '../layouts/project-management/ProjectManagementLayout';
// Pages
import AllProjects from '../pages/all-projects/AllProjects';

const Project = React.lazy(() => import('../pages/project/Project'));

const Routes: FC = () => {
  return (
    <RouterRoutes>
      <Route>
        {/* Project Management Routes */}
        <ProjectManagementLayout>
          <RouterRoutes>
            <Route path={routeNames.projectsList} element={<AllProjects />} />
          </RouterRoutes>
        </ProjectManagementLayout>
      </Route>

      <Route>
        {/* App Routes */}
        <AppLayout>
          <RouterRoutes>
            <Route path={routeNames.project} element={<Project />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </RouterRoutes>
        </AppLayout>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
