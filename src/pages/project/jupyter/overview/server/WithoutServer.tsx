// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback, useState } from 'react';
import { Box, Flex } from 'rebass';
import { Select, Value, Button } from '@logicalclocks/quartz';
// Hooks
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useJupyterSettings from '../../hooks/useJupyterSettings';
// Utils
import icons from '../../../../../sources/icons';
import { timeAliveOptions } from '../../../../../store/models/jupyter/jupyter.model';
import { getJupyterUrl, shutdownLevelToTimeAlive } from '../../utils';
// Types
import { Dispatch, RootState } from '../../../../../store';
// Services
import JupyterConfigService, {
  LSInnerKeys,
} from '../../../../../services/localStorage/JupyterConfigService';

export interface WithoutServerProps {
  isStarting: boolean;
  isStopping: boolean;
  setPopupBlocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const WithoutServer: FC<WithoutServerProps> = ({
  isStarting,
  isStopping,
  setPopupBlocked,
}) => {
  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const { data: settings } = useJupyterSettings(+projectId);

  const [timeAlive, setTimeAlive] = useState(
    shutdownLevelToTimeAlive(settings.shutdownLevel),
  );

  const handleTimeAliveChange = useCallback(
    (timeAlive: string) => {
      setTimeAlive(timeAlive);
      JupyterConfigService.set(+userId, +projectId, {
        key: LSInnerKeys.timeAlive,
        items: timeAlive as unknown as typeof timeAliveOptions,
      });
    },
    [projectId, userId],
  );

  const runServer = useCallback(async () => {
    const localSettings = JupyterConfigService.getSettings(+userId, +projectId);
    const mergedSettings = {
      ...settings,
      ...(localSettings && {
        jobConfig: {
          ...settings.jobConfig,
          ...localSettings,
        },
      }),
      shutdownLevel: (timeAliveOptions as any)[timeAlive],
    };
    const instance = await dispatch.jupyter.start({
      projectId: +projectId,
      settings: mergedSettings,
    });

    if (instance) {
      // clear localStorage once we save the new configuration in the backend.
      JupyterConfigService.clear({ userId: +userId, projectId: +projectId });

      const newWin = window.open(getJupyterUrl(instance.port, instance.token));
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        setPopupBlocked(true);
      }
    }
    // await dispatch.jupyter.clear();
    // await dispatch.jupyter.fetch({ projectId: +projectId });
  }, [
    dispatch.jupyter,
    projectId,
    setPopupBlocked,
    settings,
    timeAlive,
    userId,
  ]);

  return (
    <Flex flexDirection="column" alignItems="center" my="auto" p="20px">
      <Value fontFamily="Inter" fontSize="18px" mb="20px">
        {isStarting && 'Starting server...'}
        {isStopping && 'Stopping server...'}
        {!isStopping && !isStarting && 'No server running'}
      </Value>
      <Flex>
        <Select
          listWidth="100%"
          mr="20px"
          width="max-content"
          disabled={isStarting || isStopping}
          options={Object.keys(timeAliveOptions)}
          placeholder="shutdown after"
          onChange={([val]) => handleTimeAliveChange(val)}
          value={[String(timeAlive)]}
        />
        <Button intent="secondary" onClick={runServer} isLoading={isStarting}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              svg: {
                mr: '5px',
                height: '18px',
                width: '18px',
                path: {
                  fill: !(isStarting || isStopping) ? 'primary' : 'black',
                },
              },
            }}
          >
            {icons.play}
            Run Jupyter ↗
          </Box>
        </Button>
      </Flex>
    </Flex>
  );
};

export default WithoutServer;
