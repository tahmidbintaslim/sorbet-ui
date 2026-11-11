'use client';
// Shared motion primitives for the site.
//
// Nothing is hidden in the server HTML: the static page must read fine before (or
// without) JavaScript. After hydration, only content that is still below the fold is
// set to its hidden starting state, then springs in when scrolled to. Props never
// branch on reduced motion: <MotionConfig reducedMotion="user"> (ColorMode) drops the
// movement for those users and keeps only a short fade.
import * as React from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;
/** Bouncy but settled: for reveals and hover lifts. */
export const SPRING = { type: 'spring', stiffness: 260, damping: 20, mass: 0.9 } as const;

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * 'show' on the server and for anything on screen at hydration. Content below the
 * fold flips to 'hidden' before the browser paints the hydrated page (the visitor
 * never sees it disappear), then back to 'show' when it scrolls into view.
 */
export function useRevealPhase(ref: React.RefObject<Element | null>) {
  const [phase, setPhase] = React.useState<'show' | 'hidden'>('show');
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  useIsoLayoutEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    if (r && r.top > window.innerHeight) setPhase('hidden');
  }, [ref]);
  React.useEffect(() => {
    if (inView) setPhase('show');
  }, [inView]);
  return phase;
}

const reveal = (y: number, delay: number): Variants => ({
  hidden: { opacity: 0, y, scale: 0.97, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, delay, opacity: { duration: 0.4, delay } } },
});

/** Fade + springy rise into view once, when scrolled to. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  as = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'section' | 'li';
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref);
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp ref={ref} className={className} variants={reveal(y, delay)} initial={false} animate={phase}>
      {children}
    </Comp>
  );
}

const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const child: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.94, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...SPRING, opacity: { duration: 0.35 } } },
};

/** Container whose <StaggerItem> children spring in one after another. */
export function Stagger({
  children,
  style,
  as = 'div',
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: 'div' | 'ul';
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const phase = useRevealPhase(ref);
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp ref={ref} className={className} style={style} variants={parent} initial={false} animate={phase}>
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  style,
  as = 'div',
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: 'div' | 'li';
  className?: string;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} style={style} variants={child}>
      {children}
    </Comp>
  );
}

/**
 * Animated number. Counts to `value` whenever it changes; with `onView`, counts up
 * from 0 the first time it scrolls into view (the server HTML shows the final value).
 */
export function CountUp({
  value,
  format = (n: number) => n.toLocaleString('en-US'),
  onView = false,
}: {
  value: number;
  format?: (n: number) => string;
  onView?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const phase = useRevealPhase(ref);
  const [shown, setShown] = React.useState(value);
  const from = React.useRef(value);
  useIsoLayoutEffect(() => {
    if (onView && !reduce && phase === 'hidden') {
      from.current = 0;
      setShown(0);
    }
  }, [onView, reduce, phase]);
  React.useEffect(() => {
    if (reduce) {
      setShown(value);
      from.current = value;
      return;
    }
    if (onView && phase === 'hidden') return;
    const a = from.current;
    if (a === value) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(a + (value - a) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce, onView, phase]);
  return <span ref={ref}>{format(shown)}</span>;
}

/** True while the element is on screen: used to pause CSS loops off-screen. */
export function useOnScreen(ref: React.RefObject<Element | null>) {
  return useInView(ref, { margin: '120px' });
}
