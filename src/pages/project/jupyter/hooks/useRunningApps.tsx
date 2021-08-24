// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
import React, {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Value, Button } from '@logicalclocks/quartz';
// Hooks
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex } from 'rebass';
// Selectors
import { selectRunningApplications } from '../../../../store/models/jupyter/jupyter.selectors';
// Utils
import icons from '../../../../sources/icons';
// Types
import { ElasticToken, RunningApplication } from '../../../../types/jupiter';
import { Dispatch } from '../../../../store';
// Services
import BaseApiService, {
  RequestType,
} from '../../../../services/BaseApiService';
import useInterval from './useInterval';

export interface RunningApps {
  groupComponents: ComponentType<any>[][];
  runningApps: Record<string, any>[][];
  legend: string[];
}

const useRunningApps = (): RunningApps => {
  const { id } = useParams();

  const [deletingApp, setdeletingApp] = useState<string | null>();

  const dispatch = useDispatch<Dispatch>();

  const { data: runningApps } = useSelector(selectRunningApplications);

  const [kibanaUrl, setKibanaUrl] = useState<string | null>();

  useInterval(() => {
    dispatch.jupyter.fetchRunningApplications({ projectId: +id });
  }, 5000);

  useEffect(() => {
    const loadToken = async () => {
      const { data } = (await new BaseApiService().request({
        url: `/elastic/jwt/${id} `,
        type: RequestType.get,
      })) as { data: ElasticToken };
      if (data) {
        setKibanaUrl(data.kibanaUrl);
      }
    };

    loadToken();
  }, [id]);

  const legend = ['ID', 'YARN Application ID'];

  const handleNavigate = useCallback(
    (path: string, customOrigin = process.env.REACT_APP_API_HOST_EXEC) =>
      () => {
        window.open(`${customOrigin}/${path}`, '_blank');
      },
    [],
  );

  const getHref = useCallback(
    (path: string, customOrigin = process.env.REACT_APP_API_HOST_EXEC) => {
      return `${customOrigin}/${path}`;
    },
    [],
  );

  const handleShutdown = useCallback(
    async (appId: string) => {
      setdeletingApp(appId);
      await dispatch.jupyter.stopApplication({ projectId: +id, appId });
      setdeletingApp(null);
    },
    [dispatch.jupyter, id],
  );

  const separatorProps = useMemo(
    () => ({
      padding: '0px',
      height: '31px',
      width: '1px',
      backgroundColor: 'grayShade2',
    }),
    [],
  );

  const groupComponents = useMemo(
    () =>
      (runningApps || []).map(() => [
        Value,
        Value,
        Button,
        Flex,
        Button,
        Flex,
        Button,
        Flex,
        Button,
        Flex,
        Button,
      ]),
    [runningApps],
  );

  const groupProps = useMemo(
    () =>
      (runningApps || []).map(
        ({ id, appId, monitoring }: RunningApplication) => {
          const isDeletingApp = deletingApp === appId;
          return [
            { children: id, pr: '20px' },
            { children: appId, pr: '20px' },
            {
              px: '20px',
              children: 'Spark UI ↗',
              intent: 'ghost',
              onClick: handleNavigate(monitoring.sparkUrl),
              href: getHref(monitoring.sparkUrl),
              style: { whiteSpace: 'nowrap' },
              disabled: isDeletingApp,
            },
            separatorProps,
            {
              px: '20px',
              children: 'RM UI ↗',
              intent: 'ghost',
              onClick: handleNavigate(monitoring.yarnUrl),
              href: getHref(monitoring.yarnUrl),
              style: { whiteSpace: 'nowrap' },
              disabled: isDeletingApp,
            },
            separatorProps,
            {
              px: '20px',
              children: 'Monitor ↗',
              intent: 'ghost',
              onClick: handleNavigate(monitoring.grafanaUrl),
              href: getHref(monitoring.grafanaUrl),
              style: { whiteSpace: 'nowrap' },
              disabled: isDeletingApp,
            },
            separatorProps,
            {
              px: '20px',
              disabled: !kibanaUrl || isDeletingApp,
              children: 'Kibana ↗',
              intent: 'ghost',
              href: `${process.env.REACT_APP_API_DOMAIN}${kibanaUrl}${monitoring.kibanaUrl}`,
              onClick: () => {
                window.open(
                  `${process.env.REACT_APP_API_DOMAIN}${kibanaUrl}${monitoring.kibanaUrl}`,
                  '_blank',
                );
              },
              style: { whiteSpace: 'nowrap' },
            },
            separatorProps,
            {
              ml: '10px',
              children: (
                <Box
                  onClick={() => handleShutdown(appId)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                  Stop
                </Box>
              ),
              intent: 'alert',
              isLoading: isDeletingApp,
            },
          ];
        },
      ),
    [
      deletingApp,
      getHref,
      handleNavigate,
      handleShutdown,
      kibanaUrl,
      runningApps,
      separatorProps,
    ],
  );
  return { groupComponents, runningApps: groupProps, legend };
};

export default useRunningApps;
