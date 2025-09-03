import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-600/25">
              <Icon name="Mic" size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Welcome back</h1>
          <p className="text-gray-400 text-lg">Sign in to your VoxiFlow account</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-10 shadow-2xl shadow-black/50"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full h-12 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-200 mb-3">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full h-12 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-base"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 bg-gray-800/50 border-gray-500 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading || loading}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-2xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98]"
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
          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/40 backdrop-blur text-gray-400 font-medium">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-12 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-xl font-medium"
              onClick={() => loginWithProvider('github')}
              disabled={loading}
            >
              <Icon name="Github" size={18} className="mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-12 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-xl font-medium"
              onClick={() => loginWithProvider('google')}
              disabled={loading}
            >
              <Icon name="Mail" size={18} className="mr-2" />
              Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-base">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 text-base font-semibold transition-colors hover:underline"
            >
              Sign up
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
