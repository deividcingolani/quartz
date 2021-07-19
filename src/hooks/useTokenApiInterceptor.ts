import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// Services
import { useNavigate } from 'react-router-dom';
import TokenService from '../services/TokenService';
import BaseApiService from '../services/BaseApiService';
// Types
import { Dispatch } from '../store';
import routeNames from '../routes/routeNames';

export type UseProjectNavigate = (to: string, relativeTo?: string) => void;

const useTokenApiInterceptor = () => {
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    BaseApiService.setInterceptor(
      (response) => {
        const token = response.headers.authorization;
        // If the server returned new token we need to refresh it in the app
        if (token) {
          TokenService.set(token);
          dispatch.auth.setState({
            token,
            decodedToken: TokenService.getDecodedToken(),
          });
        }
        return response;
      },

      (error) => {
        // If request failed with previous token repeat request
        const previousToken = error.config.headers.Authorization;
        if (
          TokenService.get() &&
          error.response?.status === 401 &&
          previousToken &&
          previousToken !== TokenService.get()
        ) {
          return new Promise(
            (resolve) => () =>
              resolve(
                axios.request({
                  ...error.config,
                  headers: {
                    ...error.config.headers,
                    Authorization: TokenService.get(),
                  },
                }),
              ),
          );
        }
        if (
          TokenService.get() &&
          error.response?.status === 401 &&
          previousToken &&
          previousToken === TokenService.get()
        ) {
          TokenService.delete();
          navigate(routeNames.auth.login, { replace: true });
        }

        return Promise.reject(error);
      },
    );
  }, [dispatch, navigate]);
};

export default useTokenApiInterceptor;
