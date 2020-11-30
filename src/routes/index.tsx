import React, { FC } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routeNames from './routeNames';
// Layouts
import AppLayout from '../layouts/app/AppLayout';
import ProjectManagementLayout from '../layouts/project-management/ProjectManagementLayout';
import AuthLayout from '../layouts/auth/AuthLayout';
// Components
import Error404 from '../pages/error/404Error';
import Redirect from '../components/redirect/Redirect';
// Types
import { RootState } from '../store';
import useTokenApiInterceptor from '../hooks/useTokenApiInterceptor';
// Pages
const Project = React.lazy(() => import('../pages/project/Project'));
const ProjectCreate = React.lazy(
  () => import('../pages/project/create/ProjectCreate'),
);
const ProjectList = React.lazy(
  () => import('../pages/project/list/ProjectList'),
);

const Login = React.lazy(() => import('../pages/user/login/Login'));
const Profile = React.lazy(() => import('../pages/user/profile/Profile'));

const Routes: FC = () => {
  useTokenApiInterceptor();

  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return (
      <RouterRoutes>
        <Route>
          {/* Project Management Routes */}
          <ProjectManagementLayout>
            <RouterRoutes>
              <Route path={routeNames.project.list} element={<ProjectList />} />
              <Route
                path={routeNames.project.create}
                element={<ProjectCreate />}
              />
              <Route path={routeNames.auth.profile} element={<Profile />} />
            </RouterRoutes>
          </ProjectManagementLayout>
        </Route>

        <Route path={routeNames.project.view}>
          {/* App Routes */}
          <AppLayout>
            <RouterRoutes>
              <Route path="/*" element={<Project />} />
              <Route path="*" element={<Error404 />} />
            </RouterRoutes>
          </AppLayout>
        </Route>
        <Route path="*" element={<Redirect to="/" />} />
      </RouterRoutes>
    );
  }
  return (
    <RouterRoutes>
      {/*Auth routes*/}
      <Route>
        <AuthLayout>
          <RouterRoutes>
            <Route path={routeNames.auth.login} element={<Login />} />
            <Route path={routeNames.auth.register} element={<Login />} />
            <Route path="*" element={<Redirect to="/login" />} />
          </RouterRoutes>
        </AuthLayout>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
