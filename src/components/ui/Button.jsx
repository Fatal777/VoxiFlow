import React from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';
import { buttonHover, buttonTap, springTransition } from '../../utils/animations';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 border border-purple-500/20",
                destructive: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:shadow-red-500/25",
                outline: "border-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 backdrop-blur-sm",
                secondary: "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 hover:border-gray-600",
                ghost: "text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm",
                link: "text-purple-400 underline-offset-4 hover:underline hover:text-purple-300",
                success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl hover:shadow-green-500/25",
                warning: "bg-gradient-to-r from-yellow-600 to-yellow-700 text-white hover:from-yellow-700 hover:to-yellow-800 shadow-lg hover:shadow-xl hover:shadow-yellow-500/25",
                danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:shadow-red-500/25",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 px-4 py-2 text-xs",
                lg: "h-12 px-8 py-3 text-base",
                icon: "h-11 w-11 p-0",
                xs: "h-8 px-3 py-1.5 text-xs",
                xl: "h-14 px-10 py-3.5 text-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 14,
        sm: 16,
        default: 18,
        lg: 20,
        xl: 22,
        icon: 18,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 18;

    // Enhanced loading spinner
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    const renderIcon = () => {
        if (!iconName) return null;
        try {
            return (
                <Icon
                    name={iconName}
                    size={calculatedIconSize}
                    className={cn(
                        children && iconPosition === 'left' && "mr-3",
                        children && iconPosition === 'right' && "ml-3"
                    )}
                />
            );
        } catch {
            return null;
        }
    };

    const renderFallbackButton = () => (
        <button
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </button>
    );

    // When asChild is true, merge icons into the child element
    if (asChild) {
        try {
            if (!children || React.Children?.count(children) !== 1) {
                return renderFallbackButton();
            }

            const child = React.Children?.only(children);

            if (!React.isValidElement(child)) {
                return renderFallbackButton();
            }
            const content = (
                <>
                    {loading && <LoadingSpinner />}
                    {iconName && iconPosition === 'left' && renderIcon()}
                    {child?.props?.children}
                    {iconName && iconPosition === 'right' && renderIcon()}
                </>
            );

            const clonedChild = React.cloneElement(child, {
                className: cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full",
                    child?.props?.className
                ),
                disabled: disabled || loading || child?.props?.disabled,
                children: content,
            });

            return <Comp ref={ref} {...props}>{clonedChild}</Comp>;
        } catch {
            return renderFallbackButton();
        }
    }

    return (
        <motion.div
            whileHover={buttonHover}
            whileTap={buttonTap}
            transition={springTransition}
        >
            <Comp
                className={cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full"
                )}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <LoadingSpinner />}
                {iconName && iconPosition === 'left' && renderIcon()}
                {children}
                {iconName && iconPosition === 'right' && renderIcon()}
            </Comp>
        </motion.div>
    );
});

Button.displayName = "Button";
export default Button;