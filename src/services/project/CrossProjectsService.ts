import BaseApiService, { RequestType } from '../BaseApiService';
// Types
import { CrossUserProject } from '../../types/project';

class CrossProjectsService extends BaseApiService {
  getAllAcrossUsers = async (): Promise<CrossUserProject[]> => {
    const { data } = await this.request<CrossUserProject[]>({
      url: `/getAll`,
      type: RequestType.get,
    });
    return data;
  }; 
}

export default new CrossProjectsService('/project');
