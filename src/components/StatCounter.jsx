import { useCountUp } from '../hooks/useCountUp';

/**
 * Drop-in animated stat counter.
 * Use this inside .map() instead of calling useCountUp directly.
 */
export default function StatCounter({ value, duration = 1000, className = '', prefix = '', suffix = '', transform }) {
  const { count, ref } = useCountUp(value, duration);
  const display = transform ? transform(count) : count.toLocaleString('en-IN');
  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}
