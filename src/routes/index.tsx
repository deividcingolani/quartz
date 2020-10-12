import React, { FC } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

import routeNames from './routeNames';
// Layout
import AppLayout from '../layouts/app/AppLayout';
// Pages
import HomePage from '../pages/home/HomePage';

const Routes: FC = () => (
  <AppLayout>
    <RouterRoutes>
      <Route path={routeNames.home} element={<HomePage />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </RouterRoutes>
  </AppLayout>
);

export default Routes;
