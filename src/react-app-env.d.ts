/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_HOST: string;
    REACT_APP_API_KEY: string;
    REACT_APP_HOST_EXEC: string;
  }
}
