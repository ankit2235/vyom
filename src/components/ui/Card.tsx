import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type CardTone = 'default' | 'raised' | 'accent' | 'amber';

const tones: Record<CardTone, string> = {
  default: 'border-line bg-surface',
  raised: 'border-accent-line bg-raised',
  accent: 'border-accent-line bg-surface',
  amber: 'border-amber-line bg-surface',
};

export function Card({
  children,
  tone = 'default',
  radius = 'panel',
  className,
  as: Tag = 'div',
}: {
  readonly children: ReactNode;
  readonly tone?: CardTone;
  readonly radius?: 'panel' | 'card';
  readonly className?: string;
  readonly as?: 'div' | 'article' | 'li';
}) {
  return (
    <Tag
      className={cn(
        'border',
        radius === 'panel' ? 'rounded-panel' : 'rounded-card',
        tones[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
