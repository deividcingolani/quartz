import BaseApiService, { RequestType } from '../BaseApiService';

class DatabricksService extends BaseApiService {
  getList = async ({
    projectId,
  }: {
    projectId: number;
  }): Promise<{ data: { items: { url: string }[] } }> => {
    return this.request<any>({
      url: `${projectId}/integrations/databricks`,
      type: RequestType.get,
    });
  };

  createInstance = async ({
    projectId,
    data,
  }: {
    projectId: number;
    data: any;
  }): Promise<any> => {
    return this.request<any>({
      url: `${projectId}/integrations/databricks/${data.name}`,
      type: RequestType.post,
      data,
    });
  };

  getClusters = async ({
    projectId,
    name,
  }: {
    projectId: number;
    name: string;
  }): Promise<any> => {
    return this.request<any>({
      url: `${projectId}/integrations/databricks/${name}`,
      type: RequestType.get,
    });
  };

  configureCluster = async ({
    projectId,
    instanceName,
    clusterId,
    userName,
  }: {
    projectId: number;
    instanceName: string;
    clusterId: string;
    userName: string;
  }): Promise<any> => {
    return this.request<any>({
      url: `${projectId}/integrations/databricks/${instanceName}/clusters/${clusterId}?username=${userName}`,
      type: RequestType.post,
    });
  };
}

export default new DatabricksService('/project');
