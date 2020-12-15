import BaseApiService, { RequestType } from '../BaseApiService';

class SchematisedTagsService extends BaseApiService {
  getList = async (): Promise<any> => {
    const { data } = await this.request<any>({
      url: '',
      type: RequestType.get,
    });

    return data;
  };

  getOne = async (name: string): Promise<any> => {
    const { data } = await this.request<any>({
      url: `/${name}`,
      type: RequestType.get,
    });

    return data;
  };

  create = async (data: any): Promise<any> => {
    await this.request<any>({
      url: `?name=${data.name}`,
      type: RequestType.post,
      data,
    });
  };
}

export default new SchematisedTagsService('/tags');
