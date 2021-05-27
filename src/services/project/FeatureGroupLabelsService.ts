import BaseApiService, { RequestType } from '../BaseApiService';

class FeatureGroupLabelsService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
    featureGroupId: number,
  ): Promise<string[]> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${featureGroupId}/keywords`,
      type: RequestType.get,
    });

    return data.keywords || [];
  };

  attachKeyword = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    data: string[],
  ) =>
    this.request<any>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/keywords`,
      data: {
        keywords: data,
      },
    });

  attachLabel = (
    projectId: number,
    featureStoreId: number,
    fgId: number,
    data: string[],
  ) => {
    return this.request<any>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/featuregroups/${fgId}/keywords`,
      data: {
        keywords: data,
      },
    });
  };

  getAllKeywords = async (projectId: number): Promise<string[] | undefined> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/keywords`,
      type: RequestType.get,
    });

    return data.keywords;
  };
}

export default new FeatureGroupLabelsService('/project');
