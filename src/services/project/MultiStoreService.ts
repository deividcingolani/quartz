import BaseApiService, { RequestType } from '../BaseApiService';
// Types
import { PermissionTypes, ShareableSevices } from '../../types/multistore';

class MultiStoreService extends BaseApiService {
  getSharedWith = async ({
    id,
    name,
  }: {
    id: number;
    name: string;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//apps/hive/warehouse/${name}_featurestore.db?action=stat`,
      type: RequestType.get,
    });
    return data;
  };

  shareWith = async ({
    id,
    name,
    service,
    targeProject,
    permissionType,
  }: {
    id: number;
    name: string;
    service: ShareableSevices;
    targeProject: string;
    permissionType: PermissionTypes;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//apps/hive/warehouse/${name}_featurestore.db?action=share&target_project=${targeProject}&permission=${permissionType}&type=${service}`,
      type: RequestType.post,
    });
    return data;
  };

  unshareWith = async ({
    id,
    name,
    service,
    targeProject,
  }: {
    id: number;
    name: string;
    service: ShareableSevices;
    targeProject: string;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//apps/hive/warehouse/${name}_featurestore.db?action=unshare&target_project=${targeProject}&type=${service}`,
      type: RequestType.delete,
    });
    return data;
  };

  changeFSPermission = async ({
    id,
    name,
    targeProject,
    permissionType,
  }: {
    id: number;
    name: string;
    targeProject: string;
    permissionType: PermissionTypes;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//apps/hive/warehouse/${name}_featurestore.db?action=share_permission&permissions=${permissionType}&target_project=${targeProject}&type=${ShareableSevices.FEATURESTORE}`,
      type: RequestType.put,
    });
    return data;
  };

  changeStatsPermission = async ({
    id,
    name,
    targeProject,
    permissionType,
  }: {
    id: number;
    name: string;
    targeProject: string;
    permissionType: PermissionTypes;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//Projects/${name}/Statistics?action=share_permission&target_project=${targeProject}&permissions=${permissionType}&type=${ShareableSevices.DATASET}`,
      type: RequestType.put,
    });
    return data;
  };

  changeTDPermission = async ({
    id,
    name,
    targeProject,
    permissionType,
  }: {
    id: number;
    name: string;
    targeProject: string;
    permissionType: PermissionTypes;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//Projects/${name}/${name}_Training_Datasets?action=share_permission&target_project=${targeProject}&permissions=${permissionType}&type=${ShareableSevices.DATASET}`,
      type: RequestType.put,
    });
    return data;
  };

  replyShare = async ({
    id,
    name,
    action,
    service,
  }: {
    id: number;
    service: ShareableSevices;
    action: ShareReply;
    name: string;
  }): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${id}/dataset//apps/hive/warehouse/${name}_featurestore.db?action=${action}&type=${service}`,
      type: RequestType.post,
    });
    return data;
  };
}

export enum ShareReply {
  accept = 'accept',
  reject = 'reject',
}

export default new MultiStoreService('/project');
