// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, memo, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@logicalclocks/quartz';
import { useDispatch } from 'react-redux';
import { Box } from 'rebass';
import { usePythonEnvironments } from './usePython';
import Loader from '../../../../components/loader/Loader';
import NoData from '../../../../components/no-data/NoData';
import routeNames from '../../../../routes/routeNames';
import { Dispatch } from '../../../../store';
import getHrefNoMatching from '../../../../utils/getHrefNoMatching';

const Python: FC = () => {
  const { id: projectId } = useParams();
  const { data: dataEnvironments, isLoading: isLoadingEnvironments } =
    usePythonEnvironments(+projectId);
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();

  const onCreateEnvSubmit = useCallback(() => {
    dispatch.pythonEnvironment
      .create({ id: +projectId, version: '3.7' })
      .then(() => {
        dispatch.pythonEnvironment.getPythonEnvironments({ id: +projectId });
      });
  }, [dispatch.pythonEnvironment, projectId]);

  useEffect(() => {
    if (dataEnvironments && !('errorMsg' in dataEnvironments)) {
      const version = dataEnvironments.items[0].pythonVersion;

      navigate(
        getHrefNoMatching(
          routeNames.project.settings.pythonWithEnvironment,
          routeNames.project.value,
          true,
          { version, id: projectId },
        ),
      );
    }
  }, [projectId, navigate, dataEnvironments]);

  if (dataEnvironments === undefined || isLoadingEnvironments) {
    return <Loader />;
  }

  if ('errorMsg' in dataEnvironments) {
    return (
      <Box height="100%">
        <Box py="40px">
          <NoData mainText="No python environment" />
        </Box>
        <Box display="flex" justifyContent="center">
          <Button onClick={onCreateEnvSubmit}>Create Environment</Button>
        </Box>
      </Box>
    );
  }

  return null;
};

export default memo(Python);
