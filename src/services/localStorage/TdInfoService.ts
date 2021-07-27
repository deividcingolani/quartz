import { IStorageConnector } from '../../types/storage-connector';
import { LS_TD_INFO_KEY } from './constants';
import LocalStorageService from './LocalStorageService';

export interface TdInfoState {
  correlations: boolean;
  dataFormat: string | any[];
  description: string;
  enabled: boolean;
  histograms: boolean;
  keywords: [];
  name: string;
  storage: IStorageConnector;
  tags: any;
  listTags?: any[];
  joins?: any;
}

class TdInfoService extends LocalStorageService<TdInfoState> {
  public getInfo({
    userId,
    projectId,
  }: {
    userId: number;
    projectId: number;
  }): TdInfoState {
    return super.get(userId, projectId);
  }

  public setInfo({
    userId,
    projectId,
    data,
  }: {
    userId: number;
    projectId: number;
    data: TdInfoState;
  }): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
        [projectId]: {
          ...data,
        },
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }

  public delete({
    userId,
    projectId,
  }: {
    userId: number;
    projectId: number;
  }): void {
    const all = this.getAll();
    const userProjects = all?.[userId];
    if (userProjects?.[projectId]) {
      delete userProjects[projectId];
    }
    const updated = {
      ...all,
      [userId]: {
        ...userProjects,
      },
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(updated));
  }
}

export default new TdInfoService(LS_TD_INFO_KEY);
