import { RoleMapping } from '../../types/role-mapping';
import BaseApiService, { RequestType } from '../BaseApiService';

class RoleMappingsService extends BaseApiService {
  getList = (projectId: number) =>
    this.request<GetRoleMappings>({
      url: `${projectId}/cloud/role-mappings`,
      type: RequestType.get,
    });
}

export default new RoleMappingsService('/project');

export interface GetRoleMappings {
  count: number;
  href: string;
  items: RoleMapping[];
  type: string;
}
