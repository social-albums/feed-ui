import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ children, className = '', padding = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-white shadow-sm ring-1 ring-gray-200 ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
