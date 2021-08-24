// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useEffect, useMemo } from 'react';
// Hooks
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useNavigateRelative from '../../../../hooks/useNavigateRelative';
import useJupyterSettings from '../hooks/useJupyterSettings';
// Components
import Loader from '../../../../components/loader/Loader';
import JupyterConfigService, {
  LSInnerKeys,
} from '../../../../services/localStorage/JupyterConfigService';
// Selectors
import { selectRunningServer } from '../../../../store/models/jupyter/jupyter.selectors';
// Layouts
import JobsForm from '../../jobs/form/JobsForm';
// Types
import { Dispatch, RootState } from '../../../../store';
import { FormType } from '../../jobs/types';

const JupyterSettings: FC = () => {
  const { id: projectId } = useParams();

  const dispatch = useDispatch<Dispatch>();

  const navigate = useNavigateRelative();

  const { id: userId } = useSelector((state: RootState) => state.profile);
  const { data: settings, isLoading } = useJupyterSettings(+projectId);
  const { data: runningServer, isLoading: isServerLoading } =
    useSelector(selectRunningServer);

  const localSettings = JupyterConfigService.getSettings(+userId, +projectId);

  const isServerRunning = useMemo(() => !!runningServer, [runningServer]);

  const mergedSettings = useMemo(() => {
    const mergedSettings = settings && {
      ...settings,
      jobConfig: {
        ...settings.jobConfig,
        ...localSettings,
      },
    };
    return mergedSettings;
  }, [localSettings, settings]);

  useEffect(() => {
    dispatch.jupyter.fetchRunningServer({ projectId: +projectId });
    return () => {
      dispatch.jupyter.clear();
    };
  }, [dispatch.jupyter, projectId]);

  const handleSubmit = (data: any) => {
    JupyterConfigService.set(+userId, +projectId, {
      key: LSInnerKeys.settings,
      items: data,
    });
    navigate(`/jupyter`, 'p/:id/*');
  };

  if (!settings || isLoading || isServerLoading) {
    return <Loader />;
  }

  return (
    <JobsForm
      formType={FormType.JUPYTER}
      isLoading={false /* isFeatureStoreLoading */}
      isDisabled={false /* isSubmit */}
      initialData={mergedSettings}
      submitHandler={handleSubmit}
      canSave={!isServerRunning}
    />
  );
};

export default JupyterSettings;
