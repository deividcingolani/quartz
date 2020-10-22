import axios, { AxiosPromise } from 'axios';

// import TokenService from './TokenService';

axios.defaults.baseURL = `${process.env.REACT_APP_API_HOST}/hopsworks-api/api`;

interface ParamsInterface {
  [key: string]: string;
}

interface HeadersInterface {
  [key: string]: string;
}

export enum RequestType {
  get = 'get',
  post = 'post',
  delete = 'delete',
  patch = 'patch',
}

interface DataType {
  [key: string]: any;
}

interface RequestParamsInterface {
  url?: string;
  type?: RequestType;
  params?: ParamsInterface;
  data?: DataType;
  headers?: HeadersInterface;
}

export default class BaseApiService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly baseUrl: string = '') {}

  static getHeaders(headers: HeadersInterface = {}): HeadersInterface {
    // const token = TokenService.get();

    return {
      ...headers,
      Accept: 'application/json, text/plain, */*',
      Authorization: `ApiKey ${process.env.REACT_APP_API_KEY}`,
      // ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  getUrl(uri = ''): string {
    const divider = '?/'.includes(uri[0]) || !uri ? '' : '/';

    return `${this.baseUrl}${divider}${uri}`;
  }

  request<R = undefined>(params: RequestParamsInterface): AxiosPromise<R> {
    return axios.request({
      ...params,
      url: this.getUrl(params.url),
      headers: BaseApiService.getHeaders(params.headers),
      method: params.type,
    });
  }
}
