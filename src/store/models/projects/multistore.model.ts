import { createModel } from '@rematch/core';
import ProjectsService from '../../../services/project/ProjectsService';
import MultiStoreService, {
  ShareReply,
} from '../../../services/project/MultiStoreService';
// Types
import {
  PermissionTypes,
  ShareableSevices,
  SharedProject,
} from '../../../types/multistore';
import DatasetService from '../../../services/project/DatasetService';
import { Dataset } from '../../../types/dataset';
// Utils
import { getDatasetProject } from '../../../pages/project/settings/multistore/utils';

export interface SharedDataset extends Dataset {
  projectName: string;
  sharedBy: {
    email: string;
    firstname: string;
    href: string;
    lastname: string;
    username: string;
  };
}

export type SharedProjectsState = {
  from: SharedDataset[] | null;
  with: SharedProject[] | null;
};

const multistore = createModel()({
  state: { from: null, with: null } as SharedProjectsState,
  reducers: {
    setWith: (
      state: SharedProjectsState,
      payload: SharedProject[],
    ): SharedProjectsState => ({
      ...state,
      with: payload,
    }),
    setFrom: (
      state: SharedProjectsState,
      payload: SharedDataset[],
    ): SharedProjectsState => ({
      ...state,
      from: payload,
    }),
    clear: () => ({ from: null, with: null }),
    clearFrom: (state: SharedProjectsState) => ({
      from: null,
      with: state.with,
    }),
    clearWith: (state: SharedProjectsState) => ({
      from: state.from,
      with: null,
    }),
  },
  effects: (dispatch) => ({
    getSharedWith: async (data: {
      id: number;
      name: string;
    }): Promise<void> => {
      dispatch.multistore.clearWith();
      const { projectsSharedWith } = await MultiStoreService.getSharedWith(
        data,
      );
      const promises = await Promise.allSettled(
        projectsSharedWith.map(async (project: SharedProject) => {
          const data = await ProjectsService.get(project.id);
          return { ...project, projectTeam: data.projectTeam || [] };
        }),
      );

      const valid = (promises as unknown as any[])
        .filter((x) => x.status === 'fulfilled')
        .map((x) => x.value);

      dispatch.multistore.setWith(valid);
    },
    getSharedFrom: async ({ id }: { id: number }): Promise<void> => {
      dispatch.multistore.clearFrom();
      const { data } = await DatasetService.getList(id, true);

      const featureStores = await data.items.filter(
        (ds) => ds.shared && ds.name.includes('_featurestore'),
      );

      const withName = featureStores.map(
        (ds) =>
          ({
            ...ds,
            projectName: getDatasetProject(ds.name),
          } as SharedDataset),
      );

      dispatch.multistore.setFrom(withName);
    },
    shareWith: async (data: {
      id: number;
      name: string;
      service: ShareableSevices;
      targeProject: string;
      permissionType: PermissionTypes;
    }): Promise<any> => {
      return MultiStoreService.shareWith(data);
    },
    unshareWith: async (data: {
      id: number;
      name: string;
      service: ShareableSevices;
      targeProject: string;
    }): Promise<any> => {
      return MultiStoreService.unshareWith(data);
    },
    replyShare: async (data: {
      id: number;
      name: string;
      action: ShareReply;
      service: ShareableSevices;
    }): Promise<any> => {
      return MultiStoreService.replyShare(data);
    },
    changePermissions: async (data: {
      id: number;
      name: string;
      targeProject: string;
      permissionType: PermissionTypes;
    }): Promise<any> => {
      const promises = await Promise.allSettled([
        MultiStoreService.changeFSPermission(data),
        MultiStoreService.changeTDPermission(data),
        MultiStoreService.changeStatsPermission(data),
      ]);
      return promises
        .filter((x) => x.status === 'fulfilled')
        .map((x: any) => x.value);
    },
  }),
});

export default multistore;
