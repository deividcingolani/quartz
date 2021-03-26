import BaseApiService, { RequestType } from '../BaseApiService';
import { Expectation } from '../../types/expectation';

class ExpectationService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<Expectation[]> => {
    const { data } = await this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/expectations`,
      type: RequestType.get,
    });

    return data?.items || [];
  };

  getOne = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<Expectation[]> => {
    const { data } = await this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/expectations/${name}`,
      type: RequestType.get,
    });

    return data;
  };

  getValidations = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<Expectation[]> => {
    const { data } = await this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/validations`,
      type: RequestType.get,
    });

    return data?.items || [];
  };

  getAllList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<Expectation[]> => {
    const { data } = await this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/expectations`,
      type: RequestType.get,
    });

    return data?.items || [];
  };

  getRules = () =>
    this.request<any>({
      type: RequestType.get,
      url: `rules?sort_by=name:asc`,
    });

  create = async (
    projectId: number,
    featureStoreId: number,
    data: any,
  ): Promise<any> =>
    this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/expectations`,
      type: RequestType.put,
      data,
    });

  edit = async (
    projectId: number,
    featureStoreId: number,
    data: any,
  ): Promise<any> => this.create(projectId, featureStoreId, data);

  delete = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<any> =>
    this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/expectations/${name}`,
      type: RequestType.delete,
    });

  attach = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    name: string,
  ): Promise<any> =>
    this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/expectations/${name}`,
      type: RequestType.put,
    });

  detach = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
    name: string,
  ): Promise<any> =>
    this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/expectations/${name}`,
      type: RequestType.delete,
    });

  getAttachedFeatureGroups = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<any> =>
    this.request<any>({
      url: `project/${projectId}/featurestores/${featureStoreId}/featuregroups?filter_by=expectations:${name}`,
      type: RequestType.get,
    });
}

export default new ExpectationService('');
