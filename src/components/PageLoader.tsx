import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'var(--bg-page)' }}
    >
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--primary)] animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[var(--accent)] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" style={{ animationDuration: '0.6s' }} />
        </div>
        <p className="text-lg font-semibold animate-pulse" style={{ color: 'var(--primary)' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}
