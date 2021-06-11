import React, { FC, memo } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Loader from '../../../components/loader/Loader';
import SettingsContent from './SettingsContent';
// Hooks
import useTitle from '../../../hooks/useTitle';
import useProject from './useProject';
import titles from '../../../sources/titles';

const Settings: FC = () => {
  const { id: projectId } = useParams();

  const { project, isLoading } = useProject(+projectId);

  useTitle(titles.projectSettings);

  if (isLoading || !project) {
    return <Loader />;
  }

  return <SettingsContent data={project} />;
};

export default memo(Settings);
