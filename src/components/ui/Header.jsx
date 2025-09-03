import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Remove old localStorage check since we're using AuthContext now

  const navigationItems = [
    { 
      label: 'Home', 
      path: '/', 
      icon: 'Home',
      description: 'Platform overview and capabilities'
    },
    { 
      label: 'Upload', 
      path: '/upload-interface', 
      icon: 'Upload',
      description: 'Submit recordings for analysis'
    },
    { 
      label: 'Analysis', 
      path: '/analysis-dashboard', 
      icon: 'Activity',
      description: 'Real-time processing and insights'
    },
    { 
      label: 'Results', 
      path: '/results-summary', 
      icon: 'BarChart3',
      description: 'Comprehensive analysis summary'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate away even if logout fails
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  const secondaryActions = [
    { label: 'Settings', icon: 'Settings', action: () => navigate('/settings') },
    { label: 'Help', icon: 'HelpCircle', action: () => window.open('mailto:support@voxiflow.com', '_blank') },
    { label: 'Export', icon: 'Download', action: () => alert('Export functionality coming soon!') }
  ];

  useEffect(() => {
    const currentIndex = navigationItems?.findIndex(item => item?.path === location?.pathname);
    setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
  }, [location?.pathname]);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
        setIsMobileMenuOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location?.pathname === path;

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-nav border-b border-purple-600/30 shadow-sm ${className}`}
      initial={{ y: -100 }}
      animate={{ y: isHeaderVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-between h-20 px-8">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-4 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => navigate('/')}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-2xl hover-lift">
            <Icon name="Mic" size={24} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            VoxiFlow
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-2">
          {navigationItems?.map((item, index) => (
            <motion.button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 hover-scale group ${
                isActive(item?.path) 
                  ? 'bg-purple-600/20 text-purple-400 border-2 border-purple-600/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Icon 
                name={item?.icon} 
                size={18} 
                className={isActive(item?.path) ? 'text-purple-400' : 'text-current'} 
              />
              <span>{item?.label}</span>
              
              {/* Enhanced Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-3 bg-gray-900 border border-purple-600/30 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 whitespace-nowrap">
                <p className="text-xs text-gray-300 font-medium">{item?.description}</p>
              </div>
            </motion.button>
          ))}
        </nav>

        {/* Progress Indicator - Desktop */}
        <div className="hidden xl:flex items-center space-x-3">
          {navigationItems?.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                getStepStatus(index) === 'completed' 
                  ? 'bg-success' 
                  : getStepStatus(index) === 'current' ?'bg-primary' :'bg-muted'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 rounded-2xl border border-purple-600/30 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-white text-sm font-medium">{user.name}</span>
                  <Icon name="ChevronDown" size={16} className="text-gray-400" />
                </button>
                
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-purple-600/30 rounded-2xl shadow-lg z-20">
                    <div className="p-4 border-b border-gray-700">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <Icon name="User" size={16} />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button
                      onClick={() => navigate('/settings')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                    >
                      <Icon name="Settings" size={16} />
                      <span className="font-medium">Settings</span>
                    </button>
                    {secondaryActions?.map((action, index) => (
                      <button
                        key={action?.label}
                        onClick={action?.action}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                      >
                        <Icon name={action?.icon} size={16} />
                        <span className="font-medium">{action?.label}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-700">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-800 rounded-b-2xl transition-all duration-200"
                      >
                        <Icon name="LogOut" size={16} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login/Signup Buttons */}
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-3 rounded-2xl text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={22} />
        </Button>
      </div>
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="lg:hidden bg-gray-900 border-t border-purple-600/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-6 py-6 space-y-3">
              {navigationItems?.map((item, index) => (
                <motion.button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`flex items-center space-x-4 w-full px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${
                    isActive(item?.path) 
                      ? 'bg-purple-600/20 text-purple-400 border-2 border-purple-600/30' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={isActive(item?.path) ? 'text-purple-400' : 'text-current'} 
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold">{item?.label}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item?.description}
                    </div>
                  </div>
                  {getStepStatus(index) === 'completed' && (
                    <Icon name="Check" size={18} className="text-green-400" />
                  )}
                </motion.button>
              ))}
              
              {/* Mobile Progress */}
              <div className="flex items-center justify-center space-x-3 pt-6 border-t border-gray-700 mt-6">
                {navigationItems?.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      getStepStatus(index) === 'completed' 
                        ? 'bg-green-400' 
                        : getStepStatus(index) === 'current' ? 'bg-purple-400' : 'bg-gray-600'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  />
                ))}
              </div>

              {/* Mobile Auth/Actions */}
              <div className="pt-6 border-t border-gray-700 mt-6 space-y-2">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-5 py-4 bg-gray-800/50 rounded-2xl">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* User Actions */}
                    {secondaryActions?.map((action, index) => (
                      <motion.button
                        key={action?.label}
                        onClick={action?.action}
                        className="flex items-center space-x-4 w-full px-5 py-4 text-sm text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-2xl transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon name={action?.icon} size={18} />
                        <span className="font-medium">{action?.label}</span>
                      </motion.button>
                    ))}
                    
                    {/* Logout */}
                    <motion.button
                      onClick={handleLogout}
                      className="flex items-center space-x-4 w-full px-5 py-4 text-sm text-red-400 hover:bg-gray-800/60 rounded-2xl transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon name="LogOut" size={18} />
                      <span className="font-medium">Sign Out</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    {/* Login/Signup for Mobile */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          navigate('/login');
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-purple-600/30 text-purple-400 hover:bg-purple-600 hover:text-white"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/signup');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;