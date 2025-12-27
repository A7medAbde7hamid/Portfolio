import { useEffect, useState } from 'react';
import { trackPageView, trackContactMessage, saveContactMessage, fetchSocialLinks } from '../lib/supabase';
import { Send, Github, Linkedin, Facebook, Instagram, MessageCircle, Mail, CheckCircle, Youtube } from 'lucide-react';

// Custom TikTok Icon
const TikTokIcon = ({ size = 24, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Map platform names to icon components
const platformIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  tiktok: TikTokIcon,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  github: Github,
  whatsapp: MessageCircle,
};

// Fallback static data in case DB fetch fails
const fallbackSocials = [
  { platform: 'tiktok', url: 'https://www.tiktok.com/@a7medweb?_r=1&_t=ZS-92WTIKdUhE2', label: 'TikTok' },
  { platform: 'youtube', url: 'https://youtube.com/@fikracode?si=0g8e45mYAX5arqZe', label: 'YouTube' },
  { platform: 'instagram', url: 'https://www.instagram.com/a7medabde7hamid?igsh=YWV3NGcxbGljYXE0', label: 'Instagram' },
  { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61577086149880', label: 'Facebook' },
  { platform: 'linkedin', url: 'https://www.linkedin.com/in/ahmed-abdelhamid-611993393?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', label: 'LinkedIn' },
  { platform: 'github', url: 'https://github.com/A7medAbde7hamid', label: 'GitHub' },
];

interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  label: string;
  display_order?: number;
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(fallbackSocials);

  useEffect(() => {
    trackPageView('contact');
    
    // Fetch social links from database
    fetchSocialLinks().then(data => {
      if (data && data.length > 0) {
        setSocialLinks(data);
      }
    }).catch(() => {
      // Use fallback data on error
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await saveContactMessage(form.name, form.email, form.message);
    await trackContactMessage(form.email);
    
    setLoading(false);
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  // Filter out whatsapp from the grid (it has its own button)
  const displaySocials = socialLinks.filter(s => s.platform !== 'whatsapp');

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-up">Get In Touch</h1>
      <p className="text-lg mb-12 fade-in-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
        Have a project in mind? Let's create something amazing together.
      </p>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          {sent ? (
            <div className="glass-card p-12 text-center">
              <CheckCircle size={64} className="mx-auto mb-6" style={{ color: 'var(--primary)' }} />
              <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          )}
        </div>

        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <a href="mailto:A7medAbde7hamid@gmail.com" className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--bg-glass)] transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-glass)' }}>
                  <Mail size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="font-medium">A7medAbde7hamid@gmail.com</p>
                </div>
              </a>
              <a href="https://wa.me/201068824098" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--bg-glass)] transition-colors group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}>
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>WhatsApp</p>
                  <p className="font-medium">+20 106 882 4098</p>
                </div>
              </a>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-semibold mb-6">Follow Me</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {displaySocials.map(({ platform, url, label }) => {
                const Icon = platformIcons[platform] || Github;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                    style={{ background: 'var(--bg-glass)' }}
                    title={label}
                  >
                    <Icon size={24} style={{ color: 'var(--primary)' }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* WhatsApp CTA Button */}
          <a
            href="https://wa.me/201068824098"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            <MessageCircle size={24} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
