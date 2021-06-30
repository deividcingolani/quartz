import { Experiment } from '../../types/experiment';
import BaseApiService, { RequestType } from '../BaseApiService';
// Types

class ExperimentsService extends BaseApiService {
  getOneByName = async (
    projectId: number,
    name: string,
  ): Promise<Experiment[]> => {
    const { data } = await this.request<Experiment[]>({
      url: `${projectId}/experiments/${name}`,
      type: RequestType.get,
    });
    return data;
  };
}

export default new ExperimentsService('/project');
