import md5 from 'md5';
import BaseApiService, { RequestType } from './BaseApiService';

// Types
import { User } from '../types/user';

class ProfileService extends BaseApiService {
  get = () =>
    this.request<User>({
      type: RequestType.get,
    });

  avatar = (email: string): string =>
    `https://gravatar.com/avatar/${md5(
      email.toLocaleLowerCase(),
    )}/?d=retro&s=50`;
}

export default new ProfileService('users/profile');
