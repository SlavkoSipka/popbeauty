'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = {
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { target: 150, suffix: '+', label: 'Zadovoljnih korisnika' },
  { target: 100, suffix: '%', label: 'Prirodno' },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.target, active);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-display font-[400] text-[clamp(44px,7vw,56px)] leading-none text-[#FBFAED] tabular-nums">
        {stat.prefix}{value}{stat.suffix}
      </span>
      <span className="mt-3 font-body font-[400] text-[12px] uppercase tracking-[0.14em] text-[#FBFAED]/80 md:text-[13px]">
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#A1A797] py-16 md:py-16">
      <div className="mx-auto grid max-w-[700px] grid-cols-2 gap-8 px-6 md:gap-12">
        {stats.map((stat) => (
          <StatItem key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
