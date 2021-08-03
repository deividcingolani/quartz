// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo } from 'react';
import { useParams } from 'react-router-dom';
// Hooks
import { useSelector } from 'react-redux';
import useTitle from '../../../hooks/useTitle';
import useProject from './useProject';
import useSharedFrom from './useSharedFrom';
import useSharedWith from './useSharedWith';
// Components
import Loader from '../../../components/loader/Loader';
import SettingsContent from './SettingsContent';
import titles from '../../../sources/titles';
// Types
import { RootState } from '../../../store';

const Settings: FC = () => {
  const { id: projectId } = useParams();
  const { project, isLoading } = useProject(+projectId);

  const user = useSelector((state: RootState) => state.profile);

  const { data: sharedFrom } = useSharedFrom(+projectId);
  const { data: sharedWith } = useSharedWith(+projectId);

  useTitle(titles.projectSettings);

  if (isLoading || !project || !sharedWith || !sharedFrom || !user.email) {
    return <Loader />;
  }

  return (
    <SettingsContent
      project={project}
      sharedProjects={sharedWith}
      datasets={sharedFrom}
      user={user}
    />
  );
};

export default memo(Settings);
