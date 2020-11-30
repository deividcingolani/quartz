import BaseApiService, { RequestType } from './BaseApiService';

// Types
import { User } from '../types/user';

class AuthService extends BaseApiService {
  login = async (data: any): Promise<any> => {
    return this.request<any>({
      url: `auth/login`,
      type: RequestType.post,
      data: new URLSearchParams(data).toString(),
    });
  };

  register = async (data: any): Promise<any> => {
    return this.request<User>({
      url: `auth/register`,
      type: RequestType.post,
      data: new URLSearchParams(data).toString(),
    });
  };

  updatePassword = async (data: any): Promise<any> => {
    return this.request<User>({
      url: `users/credentials`,
      type: RequestType.post,
      data: new URLSearchParams(data).toString(),
    });
  };

  updateData = async (data: any): Promise<any> => {
    return this.request<User>({
      url: `users/profile`,
      type: RequestType.post,
      data: new URLSearchParams(data).toString(),
    });
  };
}

export default new AuthService('');
