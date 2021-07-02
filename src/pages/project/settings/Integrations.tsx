// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC } from 'react';

import Anchor from '../../../components/anchor/Anchor';
import routeNames from '../../../routes/routeNames';
import {
  ProjectCode,
  ProjectDatabricks,
  ProjectSpark,
} from '../lazyComponents';

const Integrations: FC = () => {
  const { code, spark, databricks } = routeNames.overviewAnchors;

  return (
    <>
      <Anchor groupName="spark" anchor={spark}>
        <ProjectSpark />
      </Anchor>

      <Anchor groupName="databricks" anchor={databricks}>
        <ProjectDatabricks />
      </Anchor>

      <Anchor groupName="code" anchor={code}>
        <ProjectCode />
      </Anchor>
    </>
  );
};

export default Integrations;
