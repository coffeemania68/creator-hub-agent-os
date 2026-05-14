import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return <div className={`rounded-2xl border border-line/70 bg-white shadow-ambient ${className}`} {...props} />;
}
