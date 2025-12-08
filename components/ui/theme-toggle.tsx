"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "rounded-full transition-all duration-300",
        "bg-secondary hover:bg-accent",
        "text-foreground hover:text-accent-foreground",
        "shadow-sm hover:shadow-md",
        "active:scale-95",
        sizeClasses[size],
        className
      )}
      title={
        theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"
      }
    >
      {theme === "dark" ? (
        <Sun
          size={iconSizes[size]}
          className="transition-transform hover:rotate-12"
        />
      ) : (
        <Moon
          size={iconSizes[size]}
          className="transition-transform hover:-rotate-12"
        />
      )}
    </button>
  );
}
