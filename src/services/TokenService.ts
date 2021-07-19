// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { JwtPayload } from '../types/jwt';

class TokenService {
  private key = 'token';

  get(): string | null {
    return localStorage.getItem(this.key);
  }

  set(token: string): void {
    localStorage.setItem(this.key, token);
  }

  delete(): void {
    localStorage.removeItem(this.key);
  }

  getDecodedToken(): JwtPayload {
    const token = localStorage.getItem(this.key);
    return token ? jwt_decode<JwtPayload>(token) : {};
  }
}

export default new TokenService();
