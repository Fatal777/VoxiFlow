import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Icon from '../../components/AppIcon';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithProvider, loading, error: authError } = useAuth();
  const { success, error: showError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use ScaleKit authentication
      await login({ state: 'login' });
      success('Welcome back!', {
        title: 'Login Successful',
        duration: 3000
      });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      showError('Login failed. Please check your credentials and try again.', {
        title: 'Login Failed',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">

      {/* Main Content */}
      <div className="w-full flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-sm">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4C10 2.89543 10.8954 2 12 2Z" fill="currentColor"/>
                <path d="M19 10V12C19 16.4183 15.4183 20 11 20H10V22H14C14.5523 22 15 22.4477 15 23C15 23.5523 14.5523 24 14 24H10C9.44772 24 9 23.5523 9 23C9 22.4477 9.44772 22 10 22H10V20C5.58172 20 2 16.4183 2 12V10C2 9.44772 2.44772 9 3 9C3.55228 9 4 9.44772 4 10V12C4 15.3137 6.68629 18 10 18H14C17.3137 18 20 15.3137 20 12V10C20 9.44772 20.4477 9 21 9C21.5523 9 22 9.44772 22 10Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Error Display */}
          {(error || authError) && (
            <motion.div
              className="mb-6 p-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-red-400" />
                <span>{error || authError}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full h-10 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full h-10 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-sm"
                  required
                />
              </div>
            </div>


            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || loading}
              className="w-full h-10 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium text-sm rounded-lg transition-all duration-300"
            >
              {isLoading || loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Icon name="LogIn" size={20} className="mr-2" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/30"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-gray-900/40 backdrop-blur text-gray-400">Or</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-9 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-lg text-xs"
              onClick={() => loginWithProvider('github')}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-9 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-lg text-xs"
              onClick={() => loginWithProvider('google')}
              disabled={loading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mr-1">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <span className="text-gray-400 text-xs">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </motion.div>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
