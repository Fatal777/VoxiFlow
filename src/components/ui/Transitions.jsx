import React from 'react';
import { motion } from 'framer-motion';

// Fade In Animation
export const FadeIn = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide In From Left
export const SlideInLeft = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide In From Right
export const SlideInRight = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration, delay }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scale In Animation
export const ScaleIn = ({ children, delay = 0, duration = 0.6, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger Children Animation
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover Animations
export const HoverScale = ({ children, scale = 1.05, className = "" }) => (
  <motion.div
    whileHover={{ scale }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverLift = ({ children, y = -5, className = "" }) => (
  <motion.div
    whileHover={{ y }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Tap Animation
export const TapScale = ({ children, scale = 0.95, className = "" }) => (
  <motion.div
    whileTap={{ scale }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Floating Animation
export const FloatingElement = ({ children, duration = 3, className = "" }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse Animation
export const PulseElement = ({ children, scale = [1, 1.05, 1], duration = 2, className = "" }) => (
  <motion.div
    animate={{
      scale,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Rotate Animation
export const RotateElement = ({ children, rotation = 360, duration = 20, className = "" }) => (
  <motion.div
    animate={{
      rotate: rotation,
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear"
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Page Transition
export const PageTransition = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

// Reveal Text Animation
export const RevealText = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
    viewport={{ once: true }}
    className={className}
  >
    {children}
  </motion.div>
);

// Typewriter Effect
export const TypewriterText = ({ text, delay = 0, className = "" }) => {
  const words = text.split(' ');
  
  return (
    <motion.div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: delay + index * 0.1
          }}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
};
