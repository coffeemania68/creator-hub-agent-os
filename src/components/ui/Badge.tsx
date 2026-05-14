import type { PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  tone?: 'active' | 'muted' | 'danger';
}>;

export function Badge({ children, tone = 'active' }: BadgeProps) {
  const toneClass = {
    active: 'border-primary-action/40 bg-primary-soft text-primary',
    muted: 'border-line bg-surface-container text-ink-muted',
    danger: 'border-danger/20 bg-danger-soft text-danger',
  }[tone];

  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${toneClass}`}>
      {children}
    </span>
  );
}
