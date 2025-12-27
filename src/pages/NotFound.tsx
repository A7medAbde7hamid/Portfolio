import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center fade-in-up">
        <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-royal-500 bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={18} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-primary !bg-transparent border" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
