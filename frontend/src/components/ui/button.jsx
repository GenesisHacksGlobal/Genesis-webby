import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-white text-black hover:bg-white/90 shadow font-medium",
    outline: "border border-white/15 bg-white/[0.02] hover:bg-white/10 text-white",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    ghost: "hover:bg-white/10 text-white",
  };
  const sizes = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 rounded-lg px-3 text-xs",
    lg: "h-10 rounded-xl px-8 text-base",
    icon: "h-9 w-9 p-0 flex items-center justify-center rounded-lg",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer font-mono text-xs uppercase tracking-wider",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  );
}
