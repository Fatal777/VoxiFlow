import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';

// Skip Link Component for keyboard navigation
export const SkipLink = ({ href = "#main-content", children = "Skip to main content" }) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
  >
    {children}
  </a>
);

// Screen Reader Only Text
export const ScreenReaderOnly = ({ children, className }) => (
  <span className={cn("sr-only", className)}>
    {children}
  </span>
);

// Accessible Button with proper ARIA attributes
export const AccessibleButton = React.forwardRef(({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  className,
  variant = "default",
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "default" && "bg-purple-600 text-white hover:bg-purple-700",
        variant === "outline" && "border border-gray-600 text-gray-300 hover:bg-gray-800",
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
});

AccessibleButton.displayName = "AccessibleButton";

// Accessible Input with proper labeling
export const AccessibleInput = React.forwardRef(({
  label,
  id,
  error,
  helperText,
  required = false,
  className,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
          {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={cn(errorId, helperId).trim() || undefined}
        className={cn(
          "w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
          error ? "border-red-500" : "border-gray-600",
          className
        )}
        {...props}
      />
      {helperText && (
        <p id={helperId} className="text-sm text-gray-400">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-400" role="alert">
          <Icon name="AlertCircle" size={16} className="inline mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

AccessibleInput.displayName = "AccessibleInput";

// Accessible Modal with focus management
export const AccessibleModal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      modalRef.current?.focus();
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative bg-gray-900 rounded-xl shadow-xl border border-gray-700 p-6 max-w-md w-full mx-4",
          "focus:outline-none focus:ring-2 focus:ring-purple-500",
          className
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        {...props}
      >
        {title && (
          <h2 id="modal-title" className="text-xl font-semibold text-white mb-4">
            {title}
          </h2>
        )}
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label="Close modal"
        >
          <Icon name="X" size={20} />
        </button>
        
        {children}
      </motion.div>
    </div>
  );
};

// Accessible Dropdown with keyboard navigation
export const AccessibleDropdown = ({
  trigger,
  items,
  onSelect,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);

  const handleKeyDown = (event) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0) {
          onSelect(items[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          "flex items-center justify-between w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white",
          "focus:outline-none focus:ring-2 focus:ring-purple-500",
          className
        )}
        {...props}
      >
        {trigger}
        <Icon name="ChevronDown" size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {items.map((item, index) => (
            <button
              key={index}
              ref={el => itemRefs.current[index] = el}
              role="option"
              aria-selected={focusedIndex === index}
              className={cn(
                "w-full px-4 py-2 text-left text-white hover:bg-gray-700",
                "focus:outline-none focus:bg-gray-700",
                focusedIndex === index && "bg-gray-700"
              )}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {item.label || item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Accessible Tab Component
export const AccessibleTabs = ({ tabs, activeTab, onTabChange, className }) => {
  const tabRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        onTabChange(tabs[prevIndex].id);
        tabRefs.current[prevIndex]?.focus();
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        onTabChange(tabs[nextIndex].id);
        tabRefs.current[nextIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        onTabChange(tabs[0].id);
        tabRefs.current[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        onTabChange(tabs[tabs.length - 1].id);
        tabRefs.current[tabs.length - 1]?.focus();
        break;
    }
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex border-b border-gray-700">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={el => tabRefs.current[index] = el}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={cn(
              "px-4 py-2 font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset",
              activeTab === tab.id
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-white"
            )}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="mt-4"
        >
          {activeTab === tab.id && tab.content}
        </div>
      ))}
    </div>
  );
};

// Live Region for announcements
export const LiveRegion = ({ children, level = "polite", className }) => (
  <div
    aria-live={level}
    aria-atomic="true"
    className={cn("sr-only", className)}
  >
    {children}
  </div>
);

// Progress indicator with accessibility
export const AccessibleProgress = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true,
  className 
}) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showValue && (
            <span className="text-gray-400">{percentage}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progress"}
        className="w-full bg-gray-700 rounded-full h-2"
      >
        <div
          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
