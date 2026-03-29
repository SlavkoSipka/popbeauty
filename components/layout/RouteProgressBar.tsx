'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Slim top-of-page progress bar that appears on every client-side route change.
 * Pure CSS animation — no external dependency.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevKey = useRef('');

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const key = pathname + searchParams.toString();
    if (prevKey.current && prevKey.current !== key) {
      setProgress(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }
    prevKey.current = key;
    return cleanup;
  }, [pathname, searchParams, cleanup]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (anchor.target === '_blank') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      cleanup();
      setProgress(15);
      setVisible(true);

      let value = 15;
      const tick = () => {
        value += Math.max(1, (85 - value) * 0.08);
        if (value >= 85) value = 85;
        setProgress(value);
        timerRef.current = setTimeout(tick, 200);
      };
      timerRef.current = setTimeout(tick, 100);
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      cleanup();
    };
  }, [cleanup]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
    >
      <div
        className="h-full bg-sage-mid transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
          transition: progress >= 100
            ? 'width 200ms ease-out, opacity 300ms ease-out 100ms'
            : 'width 300ms ease-out',
        }}
      />
    </div>
  );
}
