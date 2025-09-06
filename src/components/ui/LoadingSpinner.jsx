import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'default', 
  variant = 'default',
  className,
  text,
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variants = {
    default: 'border-purple-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };

  const spinner = (
    <motion.div
      className={cn(
        'border-2 rounded-full animate-spin',
        sizeClasses[size],
        variants[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 flex flex-col items-center space-y-4 border border-purple-600/30">
          {spinner}
          {text && (
            <p className="text-gray-300 text-sm font-medium">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      {spinner}
      {text && (
        <span className="text-gray-400 text-sm">{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
