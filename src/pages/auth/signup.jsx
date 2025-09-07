import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
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
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">

      {/* Main Content */}
      <div className="w-full flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-xs">
        {/* Header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4C10 2.89543 10.8954 2 12 2Z" fill="currentColor"/>
                <path d="M19 10V12C19 16.4183 15.4183 20 11 20H10V22H14C14.5523 22 15 22.4477 15 23C15 23.5523 14.5523 24 14 24H10C9.44772 24 9 23.5523 9 23C9 22.4477 9.44772 22 10 22H10V20C5.58172 20 2 16.4183 2 12V10C2 9.44772 2.44772 9 3 9C3.55228 9 4 9.44772 4 10V12C4 15.3137 6.68629 18 10 18H14C17.3137 18 20 15.3137 20 12V10C20 9.44772 20.4477 9 21 9C21.5523 9 22 9.44772 22 10Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Create account</h1>
          <p className="text-gray-400 text-xs">Join VoxiFlow</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-xl border border-purple-600/20 rounded-xl p-4 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {/* First Name */}
              <div>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className={`w-full h-8 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-xs`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className={`w-full h-8 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-xs`}
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                )}
              </div>

            {/* Email Field */}
            <div className="col-span-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className={`w-full h-8 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-xs`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="col-span-2">
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full h-8 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-xs`}
                required
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="col-span-2">
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className={`w-full h-8 bg-gray-800/30 backdrop-blur border-gray-600/50 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400/50 rounded-lg text-xs`}
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Create Account Button */}
            <div className="col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-8 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium text-xs rounded-lg transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-3 text-center">
            <span className="text-gray-400 text-xs">Have an account? </span>
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
        </motion.div>

        </div>
      </div>

    </div>
  );
};

export default SignupPage;
