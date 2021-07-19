import { JwtPayload } from '../types/jwt';

const ADMIN = 'HOPS_ADMIN';

const isAdmin = (token: JwtPayload): boolean => {
  return !!token && !!token.roles && token.roles.indexOf(ADMIN) > -1;
};

export default isAdmin;
