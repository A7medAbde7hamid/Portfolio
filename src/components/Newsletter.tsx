import { useState } from 'react';
import { Mail, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const supabaseUrl = 'https://eiqgbkpzywcpgbmovizt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcWdia3B6eXdjcGdibW92aXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MzMyNTYsImV4cCI6MjA4MjIwOTI1Nn0.Q5yCD2pEd-yrP0SM8iPzd89MVL-4OAUPUwGXFX9lNmI';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/newsletter-subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ email, name }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setMessage(data.message || 'Please check your email to confirm your subscription!');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-card p-8 text-center">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--primary)' }} />
        <h3 className="text-xl font-semibold mb-2">Check Your Email!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <button 
          onClick={() => setStatus('idle')} 
          className="mt-4 text-sm underline" 
          style={{ color: 'var(--primary)' }}
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-glass)' }}>
          <Mail size={20} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h3 className="font-semibold">Stay Updated</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Get notified about new projects and articles</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
        />
        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
          {status === 'loading' ? <Loader size={18} className="animate-spin" /> : 'Subscribe'}
        </button>
      </form>
      
      {status === 'error' && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{message}</span>
        </div>
      )}
      
      <p className="text-xs mt-3 text-center" style={{ color: 'var(--text-secondary)' }}>
        You'll receive a confirmation email to verify your subscription.
      </p>
    </div>
  );
}
