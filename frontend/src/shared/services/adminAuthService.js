/**
 * Authentication service for the Genesis Event Management Admin Panel (/admin-events).
 */

const AUTH_KEY = 'genesis_admin_session';

// Default admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'genesis2026'; // Admin credentials

export const adminAuthService = {
  /**
   * Check if the user is currently authenticated
   */
  isAuthenticated() {
    try {
      const session = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (!session) return false;
      const data = JSON.parse(session);
      return data && data.authenticated && data.expiresAt > Date.now();
    } catch {
      return false;
    }
  },

  /**
   * Login with username and password
   */
  login(username, password, remember = true) {
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();

    if (
      (cleanUser.toLowerCase() === ADMIN_USERNAME || cleanUser.toLowerCase() === 'admin@genesishacks.in') &&
      cleanPass === ADMIN_PASSWORD
    ) {
      const sessionData = {
        authenticated: true,
        user: 'Event Management Lead',
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(AUTH_KEY, JSON.stringify(sessionData));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid admin username or password. Default: admin / genesis2026',
    };
  },

  /**
   * Logout current admin
   */
  logout() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_KEY);
  },

  /**
   * Get logged-in user details
   */
  getUser() {
    try {
      const session = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },
};
