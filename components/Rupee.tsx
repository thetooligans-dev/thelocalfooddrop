import type { HTMLAttributes } from "react";

export function Rupee({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`fd-rupee ${className || ""}`.trim()} {...props}>
      ₹
    </span>
  );
}
