type ProgressBarProps = {
  value: number;
  tone?: 'primary' | 'secondary' | 'danger';
};

export function ProgressBar({ value, tone = 'primary' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(value, 100));
  const toneClass = {
    primary: 'bg-primary',
    secondary: 'bg-secondary-action',
    danger: 'bg-danger',
  }[tone];

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-high">
      <div className={`h-full rounded-full ${toneClass}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
