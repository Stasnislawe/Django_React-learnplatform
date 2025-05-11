import { LoginCredentials, RegisterCredentials, AuthTokens } from '../types/auth';
import { API_URL } from '../config';

class AuthService {
  private static instance: AuthService;
  private tokens: AuthTokens | null = null;

  private constructor() {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      this.tokens = JSON.parse(storedTokens);
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
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
      // Here you would typically make an API call to update the user's read books
      // For now, we'll keep the local storage record
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
        const response = await fetch(`${API_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.access}`,
          },
        });

        if (!response.ok) {
          throw new Error('Logout failed');
        }
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.tokens = null;
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('username');
    localStorage.removeItem('readFreeCourses');
    localStorage.removeItem('registrationPromptShown');
    localStorage.removeItem('userReadCourses');
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access;
  }

  getAccessToken(): string | null {
    return this.tokens?.access || null;
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  }
}

export const authService = AuthService.getInstance();