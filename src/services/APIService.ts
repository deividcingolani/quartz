import BaseApiService, { RequestType } from './BaseApiService';

class APIService extends BaseApiService {
  getList = async (): Promise<any> => {
    return this.request<any>({
      url: ``,
      type: RequestType.get,
    });
  };

  create = async ({ name, scope }: any): Promise<any> => {
    return this.request<any>({
      url: `?name=${name}${scope
        .map((value: string) => `&scope=${value}`)
        .join('')}`,
      type: RequestType.post,
    });
  };

  edit = async ({ name, scope }: any): Promise<any> => {
    return this.request<any>({
      url: `?action=update&&name=${name}${scope
        .map((value: string) => `&scope=${value}`)
        .join('')}`,
      type: RequestType.put,
    });
  };

  delete = async (name: string): Promise<any> => {
    return this.request<any>({
      url: `${name}`,
      type: RequestType.delete,
    });
  };

  getScopes = async (): Promise<{ data: { value: string }[] }> => {
    return this.request<any>({
      url: `scopes`,
      type: RequestType.get,
    });
  };
}

export default new APIService('/users/apiKey');
