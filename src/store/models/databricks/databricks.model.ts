import { createModel } from '@rematch/core';
import { Databricks } from '../../../types/databricks';
import DatabricksService from '../../../services/project/DatabricksService';
import { getValidPromisesValues } from '../search/deep-search.model';
import { ClusterStates } from '../../../pages/project/integrations/ClusterRow';

export type DatabricksState = Databricks[];

const databricks = createModel()({
  state: [] as DatabricksState,
  reducers: {
    setData: (
      state: DatabricksState,
      payload: DatabricksState,
    ): DatabricksState => payload,
    updateData: (
      state: DatabricksState,
      {
        clusterId,
        instanceName,
        userName,
      }: { clusterId: string; instanceName: string; userName: string },
    ): DatabricksState => {
      const copy = state.slice();

      const databrickIndex = copy.findIndex(({ url }) => url === instanceName);

      if (databrickIndex > -1) {
        const clusterIndex = copy[databrickIndex].clusters.findIndex(
          ({ id }) => id === clusterId,
        );

        if (clusterIndex > -1) {
          if (copy[databrickIndex].clusters[clusterIndex].user) {
            // @ts-ignore
            copy[databrickIndex].clusters[clusterIndex].user = {
              ...copy[databrickIndex].clusters[clusterIndex].user,
              firstname: userName,
            };
          }
          copy[databrickIndex].clusters[clusterIndex].state =
            ClusterStates.PENDING;
        }
      }

      return copy;
    },
    clear: () => [],
  },
  effects: (dispatch) => ({
    fetch: async ({ projectId }: { projectId: number }) => {
      const { data } = await DatabricksService.getList({ projectId });

      const { items = [] } = data;

      const promises = await Promise.allSettled(
        items.map(async ({ url }) => {
          const { data: clusterData } = await DatabricksService.getClusters({
            projectId,
            name: url,
          });

          const { items: clusterItems = [] } = clusterData;

          return {
            url,
            clusters: clusterItems,
          };
        }),
      );

      const mappedDatabricks = getValidPromisesValues(promises);

      dispatch.databricks.setData(mappedDatabricks);
    },
    create: async ({
      data,
    }: {
      data: {
        projectId: number;
        data: any;
      };
    }) => {
      return await DatabricksService.createInstance(data);
    },
    configureCluster: async ({
      data,
    }: {
      data: {
        projectId: number;
        instanceName: string;
        clusterId: string;
        userName: string;
      };
    }) => {
      return await DatabricksService.configureCluster(data);
    },
    updateUserAndStatus: async ({
      data,
    }: {
      data: {
        instanceName: string;
        clusterId: string;
        userName: string;
      };
    }) => {
      dispatch.databricks.updateData(data);
    },
  }),
});

export default databricks;
