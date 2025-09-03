import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, change, changeType, icon, description, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <motion.div 
      className="bg-card border border-border rounded-3xl p-6 hover-lift transition-all duration-300 premium-shadow group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl group-hover:scale-110 transition-transform duration-300"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name={icon} size={22} className="text-primary" />
          </motion.div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        </div>
        {change && (
          <motion.div 
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-background/50 ${getChangeColor()}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-semibold">{change}</span>
          </motion.div>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 font-medium">{description}</p>
      )}
      {trend && (
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-muted rounded-2xl h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-primary to-accent rounded-2xl h-3 transition-all duration-700"
              initial={{ width: 0 }}
              animate={{ width: `${trend}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-semibold">{trend}%</span>
        </div>
      )}
    </motion.div>
  );
};

export default KPICard;