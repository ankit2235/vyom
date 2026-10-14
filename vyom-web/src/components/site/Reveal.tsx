'use client';

import { useEffect } from 'react';

/**
 * A subtle fade-and-rise as sections enter the viewport, once each.
 *
 * Elements render visible by default and are only hidden at the moment this
 * arms them, so the page reads correctly with JS disabled or still loading.
 * Does nothing under prefers-reduced-motion.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.dataset.revealShown = 'true';
          observer.unobserve(target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    for (const target of targets) {
      // Anything already on screen stays put; only arm what is still below.
      if (target.getBoundingClientRect().top < window.innerHeight * 0.9) continue;
      target.dataset.revealArmed = 'true';
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
