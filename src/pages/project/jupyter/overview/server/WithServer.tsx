// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, { FC, useCallback } from 'react';
import { Box, Flex } from 'rebass';
import { Row, Value, Button, Badge } from '@logicalclocks/quartz';
// Hooks
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useRunningApps from '../../hooks/useRunningApps';
// Utils
import icons from '../../../../../sources/icons';
import { getJupyterUrl } from '../../utils';
// Types
import { Dispatch, RootState } from '../../../../../store';
import { RunningServer } from '../../../../../types/jupiter';

export interface WithServerProps {
  isStopping: boolean;
  popupBlocked: boolean;
  handleToggle: () => void;
  runningServer: false | RunningServer | null;
}

const WithServer: FC<WithServerProps> = ({
  isStopping,
  popupBlocked,
  handleToggle,
  runningServer,
}) => {
  const { id: projectId } = useParams();
  const { id: userId } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch<Dispatch>();

  const { groupComponents, runningApps, legend } = useRunningApps();

  const openJupyter = useCallback(() => {
    if (runningServer) {
      const { port, token } = runningServer;
      window.open(getJupyterUrl(port, token));
    }
  }, [runningServer]);

  const stopServer = useCallback(async () => {
    await dispatch.jupyter.stop({ projectId: +projectId, userId });
    // await dispatch.jupyter.clear();
    // await dispatch.jupyter.fetch({ projectId: +projectId });
  }, [dispatch.jupyter, projectId, userId]);

  return (
    <>
      <Flex mb="20">
        <Flex width="100%">
          <Button
            onClick={openJupyter}
            disabled={isStopping}
            intent="secondary"
          >
            Open Jupyter ↗
          </Button>
          {popupBlocked && (
            <Button onClick={handleToggle} intent="inline">
              Always open jupyter on server started
            </Button>
          )}
        </Flex>
        <Button
          onClick={stopServer}
          isLoading={isStopping}
          intent="alert"
          width="138px"
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              svg: {
                mr: '5px',
                height: '18px',
                width: '18px',
                path: {
                  fill: 'labels.red',
                },
              },
            }}
          >
            {icons.stop}
            Stop server
          </Box>
        </Button>
      </Flex>
      <Flex justifyContent="center" mb="8px">
        <Badge variant="success" value="Server running" />
      </Flex>
      {runningApps?.length ? (
        <Box
          mt="20px"
          sx={{
            'tr>td': { px: '0px' },
            'tr:last-of-type': { borderBottomWidth: '0px' },
          }}
        >
          <Row
            legend={legend}
            middleColumn={1}
            groupComponents={groupComponents}
            groupProps={runningApps}
          />
        </Box>
      ) : (
        <Flex flexDirection="column" alignItems="center" p="20px">
          <Value fontSize="18px" textAlign="center">
            No application running
          </Value>
        </Flex>
      )}
    </>
  );
};

export default WithServer;
