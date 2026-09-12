import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}

export function Card({
  children,
  className = "",
  as: Component = "section",
  ...props
}: CardProps) {
  return (
    <Component
      className={`rounded-2xl border border-[var(--line)] bg-[var(--paper)] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
