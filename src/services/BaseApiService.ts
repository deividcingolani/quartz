import axios, { AxiosError, AxiosPromise, AxiosResponse } from 'axios';
import TokenService from './TokenService';

interface ParamsInterface {
  [key: string]: string;
}

interface HeadersInterface {
  [key: string]: string | boolean;
}

export enum RequestType {
  get = 'get',
  post = 'post',
  delete = 'delete',
  patch = 'patch',
  put = 'put',
}

interface DataType {
  [key: string]: any;
}

interface RequestParamsInterface {
  url?: string;
  type?: RequestType;
  params?: ParamsInterface;
  data?: DataType | string;
  headers?: HeadersInterface;
}

export default class BaseApiService {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly baseUrl: string = '') {}

  static setInterceptor(
    success: (response: AxiosResponse) => AxiosResponse<any>,
    error: (error: AxiosError) => any,
  ) {
    axios.interceptors.response.use(success, error);
  }

  static getHeaders(headers: HeadersInterface = {}): HeadersInterface {
    const token = TokenService.get();

    return {
      ...headers,
      Accept: 'application/json, text/plain, */*',
      ...(token && {
        Authorization: token,
      }),
    };
  }

  getUrl(uri = ''): string {
    const divider = '?/'.includes(uri[0]) || !uri ? '' : '/';
    return `${process.env.REACT_APP_API_HOST}${this.baseUrl}${divider}${uri}`;
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
