import React from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { textReveal } from '../../utils/animations';

const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      variant: {
        default: "text-white",
        gradient: "bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent",
        purple: "text-purple-400",
        muted: "text-gray-300"
      },
      size: {
        xs: "text-lg sm:text-xl",
        sm: "text-xl sm:text-2xl",
        md: "text-2xl sm:text-3xl",
        lg: "text-3xl sm:text-4xl md:text-5xl",
        xl: "text-4xl sm:text-5xl md:text-6xl",
        "2xl": "text-5xl sm:text-6xl md:text-7xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "lg"
    }
  }
);

const textVariants = cva(
  "leading-relaxed",
  {
    variants: {
      variant: {
        default: "text-gray-300",
        muted: "text-gray-400",
        accent: "text-purple-300",
        white: "text-white"
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

// Heading Component
export const Heading = React.forwardRef(({
  className,
  variant,
  size,
  animated = false,
  delay = 0,
  children,
  ...props
}, ref) => {
  const Component = animated ? motion.h2 : 'h2';
  const animationProps = animated ? {
    ...textReveal,
    transition: { ...textReveal.transition, delay }
  } : {};

  return (
    <Component
      className={cn(headingVariants({ variant, size, className }))}
      ref={ref}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Heading.displayName = "Heading";

// Text Component
export const Text = React.forwardRef(({
  className,
  variant,
  size,
  animated = false,
  delay = 0,
  children,
  ...props
}, ref) => {
  const Component = animated ? motion.p : 'p';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true }
  } : {};

  return (
    <Component
      className={cn(textVariants({ variant, size, className }))}
      ref={ref}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = "Text";

// Lead Text Component (larger paragraph text)
export const Lead = React.forwardRef(({
  className,
  animated = false,
  delay = 0,
  children,
  ...props
}, ref) => {
  const Component = animated ? motion.p : 'p';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true }
  } : {};

  return (
    <Component
      className={cn("text-lg sm:text-xl text-gray-300 leading-relaxed", className)}
      ref={ref}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Lead.displayName = "Lead";

// Muted Text Component
export const Muted = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <p
      className={cn("text-sm text-gray-400", className)}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
});

Muted.displayName = "Muted";

// Code Text Component
export const Code = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <code
      className={cn(
        "relative rounded bg-gray-800 px-2 py-1 font-mono text-sm text-purple-300 border border-gray-700",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </code>
  );
});

Code.displayName = "Code";

// Blockquote Component
export const Blockquote = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-purple-600 pl-6 italic text-gray-300",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </blockquote>
  );
});

Blockquote.displayName = "Blockquote";

// List Components
export const List = React.forwardRef(({
  className,
  ordered = false,
  children,
  ...props
}, ref) => {
  const Component = ordered ? 'ol' : 'ul';
  
  return (
    <Component
      className={cn(
        "my-6 ml-6 list-disc text-gray-300 [&>li]:mt-2",
        ordered && "list-decimal",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

List.displayName = "List";

export const ListItem = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => {
  return (
    <li
      className={cn("leading-relaxed", className)}
      ref={ref}
      {...props}
    >
      {children}
    </li>
  );
});

ListItem.displayName = "ListItem";

// Gradient Text Component
export const GradientText = React.forwardRef(({
  className,
  from = "purple-400",
  to = "blue-400",
  animated = false,
  delay = 0,
  children,
  ...props
}, ref) => {
  const Component = animated ? motion.span : 'span';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true }
  } : {};

  return (
    <Component
      className={cn(
        `bg-gradient-to-r from-${from} to-${to} bg-clip-text text-transparent`,
        className
      )}
      ref={ref}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
});

GradientText.displayName = "GradientText";
