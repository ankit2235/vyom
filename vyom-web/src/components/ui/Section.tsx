import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './Container';

type SectionProps = {
  readonly children: ReactNode;
  readonly id?: string;
  readonly alt?: boolean;
  /** Omit the bottom hairline (the last section before the footer). */
  readonly flush?: boolean;
  readonly className?: string;
  readonly containerClassName?: string;
  readonly ariaLabel?: string;
};

/** 104px vertical padding, 64px on phones. Optional alternate background. */
export function Section({
  children,
  id,
  alt = false,
  flush = false,
  className,
  containerClassName,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'relative',
        alt && 'bg-alt',
        !flush && 'border-b border-hairline',
        className,
      )}
    >
      <Container className={cn('py-16 sm:py-[104px]', containerClassName)}>{children}</Container>
    </section>
  );
}
