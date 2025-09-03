import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithProvider, loading, error: authError } = useAuth();
  const { success, error: showError } = useNotification();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        company: formData.company
      });
      
      success('Account created successfully! Welcome to VoxiFlow!', {
        title: 'Welcome!',
        duration: 4000
      });
      
      // Redirect to dashboard on successful signup
      navigate('/upload-interface');
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
      showError('Failed to create account. Please check your information and try again.', {
        title: 'Signup Failed',
        duration: 6000
      });
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
      
      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-600/25">
              <Icon name="Mic" size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-base">Join VoxiFlow and transform your conversations</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-8 shadow-2xl shadow-black/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-200 mb-2">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  className="w-full h-11 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-200 mb-2">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  className="w-full h-11 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Icon name="Mail" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                Company <span className="text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <Icon name="Building" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Your company name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Icon name="Lock" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm`}
                  required
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Icon name="Lock" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-xl text-sm`}
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 bg-gray-800/50 border-gray-500 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                  required
                />
                <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* General Error */}
            {(error || authError) && (
              <div className="flex items-center gap-2 p-3 bg-red-900/30 border border-red-600/30 rounded-lg">
                <Icon name="AlertCircle" size={16} className="text-red-400" />
                <span className="text-red-400 text-sm">{error || authError}</span>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-red-400" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/40 backdrop-blur text-gray-400 font-medium">Or sign up with</span>
              </div>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-xl font-medium"
              onClick={() => loginWithProvider('github')}
              disabled={loading}
            >
              <Icon name="Github" size={16} className="mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="h-11 border-gray-600/50 bg-gray-800/20 backdrop-blur text-gray-300 hover:bg-gray-700/30 hover:border-gray-500 hover:text-white transition-all duration-300 rounded-xl font-medium"
              onClick={() => loginWithProvider('google')}
              disabled={loading}
            >
              <Icon name="Mail" size={16} className="mr-2" />
              Google
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-400 text-sm">Already have an account? </span>
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
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

export default SignupPage;
