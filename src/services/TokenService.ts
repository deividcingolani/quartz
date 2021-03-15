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
}

export default new TokenService();
