import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes as RouterRoutes, useLocation } from 'react-router-dom';
// Layouts
import AppLayout from '../layouts/app/AppLayout';
import AuthLayout from '../layouts/auth/AuthLayout';
import SearchLayout from '../layouts/search/SearchLayout';
import AccountLayout from '../layouts/account/AccountLayout';
import SettingsLayout from '../layouts/settings/SettingsLayout';
import ProjectManagementLayout from '../layouts/project-management/ProjectManagementLayout';
// Components
import Error404 from '../pages/error/404Error';
import Redirect from '../components/redirect/Redirect';
import Register from '../pages/user/login/Register';
import ForgotPassword from '../pages/user/login/ForgotPassword';
// Types
import { Dispatch, RootState } from '../store';
// Hooks
import useErrorCleaner from '../hooks/useErrorCleaner';
import useTokenApiInterceptor from '../hooks/useTokenApiInterceptor';

import routeNames from './routeNames';
import useCloseNotifications from '../hooks/useCloseNotifications';
import useLoadAfterOther from '../hooks/useLoadAfterOther';

// Pages
const DeepSearch = React.lazy(() => import('../pages/search/DeepSearch'));
// Project
const Project = React.lazy(() => import('../pages/project/Project'));
const ProjectCreate = React.lazy(
  () => import('../pages/project/create/ProjectCreate'),
);
const ProjectList = React.lazy(
  () => import('../pages/project/list/ProjectList'),
);
// Auth
const Login = React.lazy(() => import('../pages/user/login/Login'));
// Account
const Profile = React.lazy(
  () => import('../pages/user/account/profile/Profile'),
);
const Authentication = React.lazy(
  () => import('../pages/user/account/authentication/Authentication'),
);
const ApiList = React.lazy(
  () => import('../pages/user/account/api/list/ApiList'),
);
const ApiCreate = React.lazy(
  () => import('../pages/user/account/api/ApiCreate'),
);
const ApiEdit = React.lazy(() => import('../pages/user/account/api/ApiEdit'));
const SecretsList = React.lazy(
  () => import('../pages/user/account/secrets/list/SecretsList'),
);
const SecretsCreate = React.lazy(
  () => import('../pages/user/account/secrets/SecretsCreate'),
);
// Settings
const SchematisedTagsList = React.lazy(
  () => import('../pages/settings/schematised-tags/list/SchematisedTagsList'),
);
const SchematisedTagCreate = React.lazy(
  () =>
    import('../pages/settings/schematised-tags/create/SchematisedTagsCreate'),
);

export const pageToViewPathStorageName = 'last_page_path';

const Routes: FC = () => {
  useTokenApiInterceptor();

  const token = useSelector((state: RootState) => state.auth.token);

  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname !== routeNames.home &&
      location.pathname !== routeNames.auth.login
    ) {
      localStorage.setItem(pageToViewPathStorageName, location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const dispatch = useDispatch<Dispatch>();

  const { loadAfterAll } = useLoadAfterOther();

  useEffect(() => {
    if (token) {
      loadAfterAll(dispatch.profile.getUser);
    }

    dispatch.basket.getFromLocalStorage();
    window.addEventListener('storage', dispatch.basket.onUpdateStorage);

    return () => {
      window.removeEventListener('storage', dispatch.basket.onUpdateStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useErrorCleaner();
  useCloseNotifications();

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
          {/* Settings Routes */}
          <AccountLayout>
            <RouterRoutes>
              <Route path={routeNames.account.profile} element={<Profile />} />
              <Route
                path={routeNames.account.auth}
                element={<Authentication />}
              />
              <Route path={routeNames.account.api.list} element={<ApiList />} />
              <Route
                path={routeNames.account.api.create}
                element={<ApiCreate />}
              />
              <Route path={routeNames.account.api.edit} element={<ApiEdit />} />
              <Route
                path={routeNames.account.view}
                element={<Redirect to={`/${routeNames.account.profile}`} />}
              />
              <Route
                path={routeNames.account.secrets.list}
                element={<SecretsList />}
              />
              <Route
                path={routeNames.account.secrets.create}
                element={<SecretsCreate />}
              />
            </RouterRoutes>
          </AccountLayout>
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
      {/* Auth routes */}
      <Route>
        <AuthLayout>
          <RouterRoutes>
            <Route path={routeNames.auth.login} element={<Login />} />
            <Route path={routeNames.auth.register} element={<Register />} />
            <Route
              path={routeNames.auth.recover}
              element={<ForgotPassword />}
            />
            <Route path="*" element={<Redirect to="/login" />} />
          </RouterRoutes>
        </AuthLayout>
      </Route>
    </RouterRoutes>
  );
};

export default Routes;
