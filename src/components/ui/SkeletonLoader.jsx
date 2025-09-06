import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => {
  return (
    <motion.div
      className={cn(
        "animate-pulse rounded-md bg-gray-800/50",
        className
      )}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      {...props}
    />
  );
};

const SkeletonCard = ({ className }) => (
  <div className={cn("p-6 bg-gray-900/50 rounded-xl border border-gray-700", className)}>
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5, cols = 4, className }) => (
  <div className={cn("space-y-3", className)}>
    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-900/30 rounded-lg">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonChart = ({ className }) => (
  <div className={cn("p-6 bg-gray-900/50 rounded-xl border border-gray-700", className)}>
    <Skeleton className="h-6 w-1/3 mb-4" />
    <div className="h-64 flex items-end space-x-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="flex-1" 
          style={{ height: `${Math.random() * 80 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

const SkeletonAvatar = ({ size = 'default', className }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <Skeleton 
      className={cn(
        'rounded-full',
        sizeClasses[size],
        className
      )} 
    />
  );
};

const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )} 
      />
    ))}
  </div>
);

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonChart, 
  SkeletonAvatar, 
  SkeletonText 
};
