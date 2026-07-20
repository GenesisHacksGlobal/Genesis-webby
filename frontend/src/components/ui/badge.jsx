import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-white text-black hover:bg-white/80",
    secondary: "border-transparent bg-white/10 text-white hover:bg-white/20",
    outline: "text-white border-white/20 hover:border-white/40",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}
