// DriveEase wordmark — uses Exo 2 for a sleek automotive/tech feel
export default function Logo({ size = 'md', variant = 'dark' }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };
  const sz = sizes[size] || sizes.md;
  const textColor   = variant === 'light' ? 'text-white'      : 'text-gray-900';
  const accentColor = variant === 'light' ? 'text-accent-400' : 'text-primary-600';

  return (
    <span
      className={`font-logo font-extrabold leading-none tracking-tight ${sz} ${textColor} select-none`}
      style={{ fontFamily: '"Exo 2", sans-serif', letterSpacing: '-0.02em' }}
    >
      Drive<span className={accentColor} style={{ fontStyle: 'italic' }}>Ease</span>
    </span>
  );
}
