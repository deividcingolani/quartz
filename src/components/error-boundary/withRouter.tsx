import React from 'react';
import { useLocation } from 'react-router-dom';

const withRouter = (ComposedComponent: any) => (props: any) => {
  const location = useLocation();

  return <ComposedComponent location={location} {...props} />;
};

export default withRouter;
