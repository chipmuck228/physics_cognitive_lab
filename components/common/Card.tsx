import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}

export function Card({
  children,
  className = "",
  as: Component = "section",
}: CardProps) {
  return (
    <Component
      className={`rounded-2xl border border-[var(--line)] bg-[var(--paper)] ${className}`}
    >
      {children}
    </Component>
  );
}
