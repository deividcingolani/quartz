import BaseApiService, { RequestType } from '../BaseApiService';

// Types
import { User } from '../../types/user';
import { Project } from '../../types/project';

class ProjectsService extends BaseApiService {
  getList = async (): Promise<Project[]> => {
    const { data } = await this.request<GetListResponse[]>({
      type: RequestType.get,
    });

    return data.map(({ project, user }) => ({ ...project, user })) as Project[];
  };

  get = async (id: number): Promise<Project> => {
    const { data } = await this.request<Project>({
      url: String(id),
      type: RequestType.get,
    });

    return data;
  };
  create = async (data: any): Promise<any> => {
    await this.request<any>({
      url: ``,
      type: RequestType.post,
      data,
    });
  };
  edit = async (id: number, data: any): Promise<any> => {
    await this.request<any>({
      url: `/${id}`,
      type: RequestType.put,
      data,
    });
  };
  delete = async (id: number): Promise<any> => {
    await this.request<any>({
      url: `/${id}/delete`,
      type: RequestType.post,
    });
  };
}

interface GetListResponse {
  project: Omit<Project, 'user'>;
  user: User;
}

export default new ProjectsService('/project');
