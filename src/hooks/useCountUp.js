import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `target` when the element enters viewport.
 * @param {number} target   – final value
 * @param {number} duration – ms (default 1800)
 * @param {number} delay    – ms before starting (default 0)
 */
export function useCountUp(target, duration = 1800, delay = 0) {
  const [count, setCount]     = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Observe when the element enters the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Run animation once started
  useEffect(() => {
    if (!started) return;
    const timeout = setTimeout(() => {
      const start  = performance.now();
      const step   = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, target, duration, delay]);

  return { count, ref };
}
