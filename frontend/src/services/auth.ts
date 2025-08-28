import { LoginCredentials, RegisterCredentials, AuthTokens } from '../types/auth';
import { API_URL } from '../config';

class AuthService {
  private static instance: AuthService;
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;

  private constructor() {
    this.initializeFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private initializeFromStorage(): void {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      this.tokens = JSON.parse(storedTokens);
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await fetch(`${API_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    this.setTokens(data);
    localStorage.setItem('username', credentials.username);

    // Transfer free books read status to the authenticated user
    const readFreeBooks = JSON.parse(localStorage.getItem('readFreeCourses') || '[]');
    if (readFreeBooks.length > 0) {
      localStorage.setItem('userReadCourses', JSON.stringify(readFreeBooks));
    }
  }

  async register(credentials: RegisterCredentials): Promise<void> {
    const response = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    window.location.href = '/login';
  }

  async logout(): Promise<void> {
    if (this.tokens?.access) {
      try {
        // Попытка blacklist токена на сервере
        await fetch(`${API_URL}/token/blacklist/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.access}`,
          },
          body: JSON.stringify({ refresh: this.tokens.refresh }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearAuthData();
  }

  async refreshAuthToken(): Promise<string> {
    if (!this.tokens?.refresh) {
      throw new Error('No refresh token available');
    }

    // Если уже идет процесс обновления, возвращаем существующий промис
    if (this.refreshPromise) {
      return this.refreshPromise.then(tokens => tokens.access);
    }

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${API_URL}/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: this.tokens!.refresh }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const newTokens = await response.json();
        this.setTokens(newTokens);
        resolve(newTokens);
      } catch (error) {
        this.clearAuthData();
        reject(error);
      } finally {
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise.then(tokens => tokens.access);
  }

  async authenticatedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let accessToken = this.getAccessToken();

    if (!accessToken) {
      throw new Error('No authentication token');
    }

    // Первый запрос с текущим токеном
    const requestInit = {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    let response = await fetch(input, requestInit);

    // Если токен истек, пытаемся обновить и повторить запрос
    if (response.status === 401) {
      try {
        accessToken = await this.refreshAuthToken();

        // Повторяем запрос с новым токеном
        const retryInit = {
          ...init,
          headers: {
            ...init?.headers,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        };

        response = await fetch(input, retryInit);
      } catch (refreshError) {
        this.clearAuthData();
        window.location.href = '/login';
        throw refreshError;
      }
    }

    return response;
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access;
  }

  getAccessToken(): string | null {
    return this.tokens?.access || null;
  }

  getRefreshToken(): string | null {
    return this.tokens?.refresh || null;
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }

  private clearAuthData(): void {
    this.tokens = null;
    this.refreshPromise = null;
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('username');
    localStorage.removeItem('readFreeCourses');
    localStorage.removeItem('registrationPromptShown');
    localStorage.removeItem('userReadCourses');
  }
}

export const authService = AuthService.getInstance();