import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, description, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-400';
    if (changeType === 'negative') return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <motion.div 
      className="bg-gray-800/50 border border-purple-600/20 rounded-xl p-4 hover:border-purple-400/50 transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-600/20 rounded-lg">
            <Icon name={icon} size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-1">{title}</h3>
            <p className="text-lg font-bold text-white">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-700/50 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={12} />
            <span className="text-xs font-semibold">{change}</span>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-400 mb-3">{description}</p>
      )}
      {trend && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${trend}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-gray-400 font-semibold">{trend}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;