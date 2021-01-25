import BaseApiService, { RequestType } from '../BaseApiService';
import {
  TrainingDataset,
  TrainingDatasetQuery,
} from '../../types/training-dataset';

import { Provenance } from '../../types/feature-group';
import { GetStatisticsData } from './FeatureGroupsService';


class TrainingDatasetService extends BaseApiService {
  getList = async (
    projectId: number,
    featureStoreId: number,
  ): Promise<TrainingDataset[]> => {
    const { data } = await this.request<TrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets`,
      type: RequestType.get,
    });

    return data;
  };

  getProvenance = (
    projectId: number,
    featureStoreId: number,
    trainingDataset: TrainingDataset,
  ) => {
    const { name, version } = trainingDataset;
    return this.request<Provenance>({
      url: `${projectId}/provenance/links?only_apps=true&full_link=true&filter_by=OUT_ARTIFACT:${name}_${version}&filter_by=IN_TYPE:FEATURE&filter_by=OUT_TYPE:TRAINING_DATASET`,
      type: RequestType.get,
    });
  };

  getOneByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
  ): Promise<TrainingDataset[]> => {
    const { data } = await this.request<TrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${name}`,
      type: RequestType.get,
    });
    return data;
  };

  get = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<TrainingDataset> => {
    const { data } = await this.request<TrainingDataset>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}`,
      type: RequestType.get,
    });

    return data;
  };

  getQuery = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<TrainingDatasetQuery> => {
    const { data } = await this.request<TrainingDatasetQuery>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/query`,
      type: RequestType.get,
    });

    return data;
  };

  getByName = async (
    projectId: number,
    featureStoreId: number,
    name: string,
    version: number,
  ): Promise<TrainingDataset[]> => {
    const { data } = await this.request<TrainingDataset[]>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${name}?version=${version}`,
      type: RequestType.get,
    });

    return data;
  };

  getStatistics = (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
    timeCommit?: string,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/statistics?${
        timeCommit
          ? `filter_by=commit_time_eq:${timeCommit}`
          : 'sort_by=commit_time:desc&offset=0&limit=1'
      }&fields=content`,
      type: RequestType.get,
    });

  getCommits = (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ) =>
    this.request<GetStatisticsData>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/statistics`,
      type: RequestType.get,
    });

  getWriteLast = async (
    projectId: number,
    featureStoreId: number,
    trainingDatasetId: number,
  ): Promise<string> => {
    const { data } = await this.request<any>({
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${trainingDatasetId}/provenance/usage?type=WRITE_LAST`,
      type: RequestType.get,
    });
    return (
      data?.writeLast?.timestamp &&
      new Date(data.writeLast.timestamp).toISOString()
    );
  };

  attachKeywords = (
    projectId: number,
    featureStoreId: number,
    tdId: number,
    data: string[],
  ) =>
    this.request<any>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${tdId}/keywords`,
      data: {
        keywords: data,
      },
    });

  create = (projectId: number, featureStoreId: number, data: any) =>
    this.request<any>({
      type: RequestType.post,
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets`,
      data,
    });

  attachTag = (
    projectId: number,
    featureStoreId: number,
    tdId: number,
    name: string,
    data: any,
  ) =>
    this.request<any>({
      type: RequestType.put,
      url: `${projectId}/featurestores/${featureStoreId}/trainingdatasets/${tdId}/tags/${name}`,
      data,
    });
}

export default new TrainingDatasetService('/project');
