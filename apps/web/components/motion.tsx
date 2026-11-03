'use client';
// Shared motion primitives for the site. Everything respects
// prefers-reduced-motion: with it on, content renders in its final state.
import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Fade + rise into view once, when scrolled to. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li';
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

const parent: Variants = { show: { transition: { staggerChildren: 0.07 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** Container whose <StaggerItem> children reveal one after another. */
export function Stagger({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      style={style}
      variants={parent}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div style={style} variants={child}>
      {children}
    </motion.div>
  );
}

/** Animated number that counts to `value` whenever it changes. */
export function CountUp({ value, format = (n: number) => n.toLocaleString('en-US') }: { value: number; format?: (n: number) => string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  React.useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(a + (value - a) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce]);
  return <>{format(shown)}</>;
}
