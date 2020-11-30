import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Services
import TokenService from '../services/TokenService';
import BaseApiService from '../services/BaseApiService';
// Types
import { Dispatch } from '../store';

export type UseProjectNavigate = (to: string, relativeTo?: string) => void;

const useTokenApiInterceptor = () => {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    BaseApiService.setInterceptor(
      (response) => {
        const token = response.headers.authorization?.split(' ')[1];
        // If the server returned new token we need to refresh it in the app
        if (token) {
          TokenService.set(token);
          dispatch.auth.setState({
            token,
          });
        }
        return response;
      },

      (error) => {
        // If request failed with previous token repeat request
        const previousToken = error.config.headers.Authorization?.split(' ')[1];
        if (
          TokenService.get() &&
          error.response?.status === 401 &&
          previousToken &&
          previousToken !== TokenService.get()
        ) {
          return new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  axios.request({
                    ...error.config,
                    headers: {
                      ...error.config.headers,
                      Authorization: `Bearer ${TokenService.get()}`,
                    },
                  }),
                ),
              5000,
            ),
          );
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);
};

export default useTokenApiInterceptor;
