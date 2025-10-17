interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly EXPIRES_AT_KEY = 'expires_at';

  static setTokens(tokenData: TokenData): void {
    // Store in sessionStorage for security (not localStorage)
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
    sessionStorage.setItem(this.EXPIRES_AT_KEY, tokenData.expiresAt.toString());
  }

  static getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getExpiresAt(): number | null {
    const expiresAt = sessionStorage.getItem(this.EXPIRES_AT_KEY);
    return expiresAt ? parseInt(expiresAt, 10) : null;
  }

  static clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.EXPIRES_AT_KEY);
  }

  static isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;
    
    // Check if token expires in next 5 minutes
    return Date.now() >= (expiresAt - 5 * 60 * 1000);
  }

  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}

export default TokenStorage;
