import { createModel } from '@rematch/core';

// Services
import AuthService from '../../../services/AuthService';
import TokenService from '../../../services/TokenService';
import { JwtPayload } from '../../../types/jwt';

export interface AuthStateState {
  token: string | null;
  decodedToken: JwtPayload;
}

const handleAuthError = async (fn: () => any) => {
  try {
    await fn();
  } catch (e) {
    if (e.message === 'Network Error') {
      throw e;
    }

    return {
      error: true,
      message:
        e?.response?.data?.usrMsg ||
        e?.response?.data?.errorMsg ||
        'Wrong credentials',
    };
  }
  return { error: false, message: '' };
};

const auth = createModel()({
  state: {
    token: TokenService.get(),
    decodedToken: TokenService.getDecodedToken(),
  },
  reducers: {
    setState: (_: AuthStateState, payload: AuthStateState): AuthStateState =>
      payload,
    clear: () => ({
      token: null,
      decodedToken: {},
    }),
  },
  effects: (dispatch) => ({
    login: async ({ data }: { data: any }): Promise<any> => {
      return handleAuthError(() => AuthService.login(data));
    },
    register: async ({ data }: { data: any }): Promise<any> => {
      return handleAuthError(() => AuthService.register(data));
    },
    recoverPassword: async ({ data }: { data: string }): Promise<any> => {
      return handleAuthError(() => AuthService.recoverPassword(data));
    },
    updatePassword: async ({ data }: { data: any }): Promise<any> => {
      return handleAuthError(() => AuthService.updatePassword(data));
    },
    updateData: async ({ data }: { data: any }): Promise<any> => {
      return handleAuthError(async () => {
        const { data: user } = await AuthService.updateData(data);
        dispatch.profile.setUser(user);
      });
    },
  }),
});

export default auth;
