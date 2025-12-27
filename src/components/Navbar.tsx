import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../App';
import { Sun, Moon, Menu, X, Home, User, Briefcase, Award, Code2, Mail, Settings, BookOpen } from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/about', label: 'About', icon: User },
  { to: '/projects', label: 'Projects', icon: Briefcase },
  { to: '/case-studies', label: 'Case Studies', icon: BookOpen },
  { to: '/certificates', label: 'Certificates', icon: Award },
  { to: '/skills', label: 'Skills', icon: Code2 },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card !rounded-none border-x-0 border-t-0" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight" style={{ color: 'var(--primary)' }}>
          Ahmed<span style={{ color: 'var(--text-primary)' }}>.dev</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === to
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-[var(--bg-glass)] transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
          </button>
          
          <Link to="/admin" className="hidden md:flex p-2 rounded-full hover:bg-[var(--bg-glass)] transition-colors">
            <Settings size={20} className="text-[var(--text-secondary)]" />
          </Link>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-card mx-4 mb-4 p-4 !rounded-2xl">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
                pathname === to ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)]">
            <Settings size={18} /> Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
