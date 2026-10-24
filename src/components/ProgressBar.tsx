// src/components/ProgressBar.tsx
interface ProgressBarProps {
  value: number  // 0-100
  label?: string
  small?: boolean
  color?: string
}

export function ProgressBar({ value, label, small = false, color }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  const barColor = color ?? 'var(--color-sage)'

  return (
    <div>
      {label && (
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs text-[color:var(--color-text-secondary)]">{label}</span>
          <span className="text-xs font-mono text-[color:var(--color-text-tertiary)]">{pct}%</span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${small ? 'h-1' : 'h-1.5'}`}
        style={{ backgroundColor: 'var(--color-ivory-border)' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progress: ${pct}%`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}
