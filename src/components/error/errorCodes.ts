/* CLIENT ERROR RESPONSES */
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;

export const isClientError = (errCode: number): boolean =>
  errCode >= 400 && errCode < 500;

/* SERVER ERROR RESPONSES */
export const isServerError = (errCode: number): boolean => errCode >= 500;
