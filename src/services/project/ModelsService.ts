import { Model } from '../../types/model';
import BaseApiService, { RequestType } from '../BaseApiService';
// Types

class ModelsService extends BaseApiService {
  getOneByName = async (projectId: number, name: string): Promise<Model[]> => {
    const { data } = await this.request<Model[]>({
      url: `${projectId}/models/${name}`,
      type: RequestType.get,
    });
    return data;
  };
}

export default new ModelsService('/project');
