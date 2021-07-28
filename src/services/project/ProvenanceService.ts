import { OutTypes } from '../../components/provenance/types';
import { FeatureGroup } from '../../types/feature-group';
import { Direction, Provenance } from '../../types/provenance';
import BaseApiService, { RequestType } from '../BaseApiService';

class ProvenanceService extends BaseApiService {
  getProvenance = async ({
    projectId,
    direction,
    datasetName,
    datasetVersion,
    rootType,
  }: {
    projectId: number;
    direction: Direction;
    datasetName: string;
    datasetVersion?: number;
    rootType?: OutTypes;
  }): Promise<Provenance> => {
    const { data } = await this.request<Provenance>({
      url: `${projectId}/provenance/links?only_apps=true&full_link=true${
        rootType ? `&filter_by=${direction.toUpperCase()}_TYPE:${rootType}` : ''
      }&filter_by=${direction.toUpperCase()}_ARTIFACT:${datasetName}${
        datasetVersion ? `_${datasetVersion}` : ''
      }`,
      type: RequestType.get,
    });
    return data;
  };

  getTDProvenance = async ({
    projectId,
    featureGroup,
  }: {
    projectId: number;
    featureGroup: FeatureGroup;
  }): Promise<Provenance> => {
    const { name, version } = featureGroup;
    const { data } = await this.request<Provenance>({
      url: `${projectId}/provenance/links?filter_by=IN_ARTIFACT:${name}_${version}&filter_by=IN_TYPE:FEATURE&filter_by=OUT_TYPE:TRAINING_DATASET`,
      type: RequestType.get,
    });
    return data;
  };
}

export default new ProvenanceService('/project');
