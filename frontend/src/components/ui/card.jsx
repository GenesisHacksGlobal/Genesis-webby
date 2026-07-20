import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.02] text-white shadow-sm transition-all overflow-hidden",
        className
      )}
      {...props}
    />
  );
}
