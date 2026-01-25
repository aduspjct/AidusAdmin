import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-theme-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      success:
        "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
      error:
        "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500",
      warning:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-orange-400",
      info: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500",
      light: "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-100",
      dark: "bg-gray-500 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-blue-600 text-white dark:text-white",
      success: "bg-green-600 text-white dark:text-white",
      error: "bg-red-600 text-white dark:text-white",
      warning: "bg-yellow-600 text-white dark:text-white",
      info: "bg-blue-600 text-white dark:text-white",
      light: "bg-gray-400 dark:bg-gray-700/50 text-white dark:text-gray-100",
      dark: "bg-gray-700 text-white dark:text-white",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
