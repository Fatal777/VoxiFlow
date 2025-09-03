import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover-scale",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 premium-shadow",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 premium-shadow",
                outline: "border-2 border-input hover:bg-accent hover:text-accent-foreground hover:border-accent/50 premium-shadow",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 premium-shadow",
                ghost: "hover:bg-accent hover:text-accent-foreground rounded-2xl",
                link: "text-primary underline-offset-4 hover:underline rounded-2xl",
                success: "bg-success text-success-foreground hover:bg-success/90 premium-shadow",
                warning: "bg-warning text-warning-foreground hover:bg-warning/90 premium-shadow",
                danger: "bg-error text-error-foreground hover:bg-error/90 premium-shadow",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-2xl px-4",
                lg: "h-14 rounded-2xl px-10",
                icon: "h-12 w-12",
                xs: "h-8 rounded-2xl px-3 text-xs",
                xl: "h-16 rounded-2xl px-12 text-base",
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
    );
});

Button.displayName = "Button";
export default Button;