import BaseApiService, { RequestType } from './BaseApiService';

class SecretsService extends BaseApiService {
  getList = async (): Promise<any> => {
    return this.request<any>({
      url: ``,
      type: RequestType.get,
    });
  };

  get = async (name: any): Promise<any> => {
    return this.request<any>({
      url: `${name}`,
      type: RequestType.get,
    });
  };

  create = async (data: any): Promise<any> => {
    return this.request<any>({
      url: ``,
      data,
      type: RequestType.post,
    });
  };

  delete = async (name: string): Promise<any> => {
    return this.request<any>({
      url: `${name}`,
      type: RequestType.delete,
    });
  };
}

export default new SecretsService('/users/secrets');
