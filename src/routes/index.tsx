import React, { FC, useEffect } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import routeNames from './routeNames';
// Layouts
import AppLayout from '../layouts/app/AppLayout';
import ProjectManagementLayout from '../layouts/project-management/ProjectManagementLayout';
import AuthLayout from '../layouts/auth/AuthLayout';
import SettingsLayout from '../layouts/settings/SettingsLayout';
import SearchLayout from '../layouts/search/SearchLayout';
// Components
import Error404 from '../pages/error/404Error';
import Redirect from '../components/redirect/Redirect';
// Types
import { Dispatch, RootState } from '../store';
// Hooks
import useErrorCleaner from '../hooks/useErrorCleaner';
import useTokenApiInterceptor from '../hooks/useTokenApiInterceptor';

// Pages
const DeepSearch = React.lazy(() => import('../pages/search/DeepSearch'));

const Project = React.lazy(() => import('../pages/project/Project'));
const ProjectCreate = React.lazy(
  () => import('../pages/project/create/ProjectCreate'),
);
const ProjectList = React.lazy(
  () => import('../pages/project/list/ProjectList'),
);

const Login = React.lazy(() => import('../pages/user/login/Login'));
const Profile = React.lazy(() => import('../pages/user/profile/Profile'));

const SchematisedTagsList = React.lazy(
  () => import('../pages/settings/schematised-tags/list/SchematisedTagsList'),
);
const SchematisedTagCreate = React.lazy(
  () =>
    import('../pages/settings/schematised-tags/create/SchematisedTagsCreate'),
);

const Routes: FC = () => {
  useTokenApiInterceptor();

  const token = useSelector((state: RootState) => state.auth.token);

  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.profile.getUser();
    dispatch.basket.getFromLocalStorage();
    window.addEventListener('storage', dispatch.basket.onUpdateStorage);

    return () => {
      window.removeEventListener('storage', dispatch.basket.onUpdateStorage);
    };
  }, [dispatch]);

  useErrorCleaner();

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

        <Route>
          {/* Settings Routes */}
          <SettingsLayout>
            <RouterRoutes>
              <Route
                path={routeNames.settings.schematisedTags.list}
                element={<SchematisedTagsList />}
              />
              <Route
                path={routeNames.settings.schematisedTags.create}
                element={<SchematisedTagCreate />}
              />
              <Route
                path={routeNames.settings.view}
                element={
                  <Redirect
                    to={`/${routeNames.settings.schematisedTags.list}`}
                  />
                }
              />
            </RouterRoutes>
          </SettingsLayout>
        </Route>

        <Route>
          {/* Search Routes */}
          <SearchLayout>
            <RouterRoutes>
              <Route path={routeNames.search.view} element={<DeepSearch />} />
              <Route
                path="search"
                element={<Redirect to="/search/features" />}
              />
            </RouterRoutes>
          </SearchLayout>
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
