import React, { createContext, useContext, useState, useEffect } from 'react';
import { scalekitAuth } from '../lib/scalekit';
import { authService, supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing Supabase session
        const session = await authService.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          // Fallback to localStorage for demo mode
          const demoSession = localStorage.getItem('voxiflow_session');
          if (demoSession) {
            const sessionData = JSON.parse(demoSession);
            setUser(sessionData.user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fallback to localStorage for demo mode
        const demoSession = localStorage.getItem('voxiflow_session');
        if (demoSession) {
          const sessionData = JSON.parse(demoSession);
          setUser(sessionData.user);
          setIsAuthenticated(true);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login with ScaleKit
  const login = async (options = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Generate ScaleKit authorization URL
      const authUrl = await scalekitAuth.getAuthorizationUrl({
        state: options.state || 'login',
        ...options
      });

      // Redirect to ScaleKit hosted login
      window.location.href = authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to initiate login');
      setLoading(false);
    }
  };

  // Handle ScaleKit callback
  const handleAuthCallback = async (code, state) => {
    try {
      setLoading(true);
      setError(null);

      // Exchange code for tokens
      const authResult = await scalekitAuth.handleCallback(code, state);
      
      // Store user data and tokens
      setUser(authResult.user);
      localStorage.setItem('voxiflow_user', JSON.stringify(authResult.user));
      localStorage.setItem('voxiflow_access_token', authResult.access_token);
      
      if (authResult.refresh_token) {
        localStorage.setItem('voxiflow_refresh_token', authResult.refresh_token);
      }

      return authResult.user;
    } catch (error) {
      console.error('Auth callback error:', error);
      setError('Authentication failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase signup first
      try {
        const result = await authService.signUp(userData.email, userData.password, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          company: userData.company
        });
        
        if (result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
          return result;
        }
      } catch (supabaseError) {
        console.log('Supabase signup failed, using demo mode:', supabaseError);
      }

      // Fallback to ScaleKit or demo mode
      const result = await scalekitAuth.signup(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        // Store session
        localStorage.setItem('voxiflow_session', JSON.stringify({
          user: result.user,
          token: result.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        }));
        
        return result;
      } else {
        throw new Error(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Social login function
  const loginWithProvider = async (provider) => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase social login
      const result = await authService.signInWithProvider(provider);
      return result;
    } catch (error) {
      console.error('Social login error:', error);
      setError(`Failed to login with ${provider}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      
      const accessToken = localStorage.getItem('voxiflow_access_token');
      
      if (accessToken) {
        // Logout from ScaleKit
        await scalekitAuth.logout(accessToken);
      }
      
      // Clear local storage
      localStorage.removeItem('voxiflow_user');
      localStorage.removeItem('voxiflow_access_token');
      localStorage.removeItem('voxiflow_refresh_token');
      
      // Clear user state
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if ScaleKit logout fails
      localStorage.removeItem('voxiflow_user');
      localStorage.removeItem('voxiflow_access_token');
      localStorage.removeItem('voxiflow_refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem('voxiflow_refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const tokenResult = await scalekitAuth.refreshToken(refreshToken);
      
      // Update stored tokens
      localStorage.setItem('voxiflow_access_token', tokenResult.access_token);
      
      if (tokenResult.refresh_token) {
        localStorage.setItem('voxiflow_refresh_token', tokenResult.refresh_token);
      }

      return tokenResult.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      // Update user data locally (ScaleKit profile updates depend on provider)
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('voxiflow_user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    loginWithProvider,
    logout,
    handleAuthCallback,
    refreshAccessToken,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
