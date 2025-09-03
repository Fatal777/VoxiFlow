import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/AppIcon';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addNotification({ ...options, type: 'success', message });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({ ...options, type: 'error', message, duration: 7000 });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({ ...options, type: 'warning', message });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({ ...options, type: 'info', message });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10 backdrop-blur',
          border: 'border-green-500/30',
          text: 'text-green-400',
          icon: 'CheckCircle',
        };
      case 'error':
        return {
          bg: 'bg-red-500/10 backdrop-blur',
          border: 'border-red-500/30',
          text: 'text-red-400',
          icon: 'AlertCircle',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10 backdrop-blur',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          icon: 'AlertTriangle',
        };
      default:
        return {
          bg: 'bg-purple-500/10 backdrop-blur',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          icon: 'Info',
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const styles = getNotificationStyles(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`${styles.bg} ${styles.border} border rounded-2xl p-4 shadow-2xl shadow-black/20 min-w-80`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Icon name={styles.icon} size={20} className={styles.text} />
                </div>
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <h4 className={`text-sm font-semibold ${styles.text} mb-1`}>
                      {notification.title}
                    </h4>
                  )}
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {notification.message}
                  </p>
                  {notification.action && (
                    <button
                      onClick={notification.action.onClick}
                      className={`mt-2 text-xs font-medium ${styles.text} hover:underline`}
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;
