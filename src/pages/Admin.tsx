import { useState, useEffect } from 'react';
import { Eye, Briefcase, Award, Code2, Trash2, Plus, LogOut, Save, Upload, Image, Github, Mail, BookOpen, RefreshCw, Star, GitFork, Share2, Type, FileText, Link2 } from 'lucide-react';
import { adminLogin, adminCreate, adminUpdate, adminDelete, uploadImage, fetchProjects, fetchCertificates, fetchSkills, getAnalyticsCount, fetchHeroSettings, fetchCaseStudies, fetchGithubRepos, fetchSubscribers, deleteSubscriber, fetchSocialLinks } from '../lib/supabase';

type Tab = 'dashboard' | 'projects' | 'certificates' | 'skills' | 'hero' | 'github' | 'casestudies' | 'newsletter' | 'socials';

interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  profile_image: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
  cv_button_text: string;
  cv_file: string;
}

const DEFAULT_HERO: HeroData = {
  name: 'Ahmed Abdulhamid',
  title: 'Hi, I\'m',
  subtitle: 'Front-End Developer & AI Specialist',
  description: 'I craft beautiful, intelligent web experiences that merge cutting-edge technology with exceptional user interfaces.',
  profile_image: '/profile.jpg',
  cta_primary_text: 'View My Work',
  cta_primary_link: '/projects',
  cta_secondary_text: 'Get In Touch',
  cta_secondary_link: '/contact',
  cv_button_text: 'Download CV',
  cv_file: '/resume.pdf',
};

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [projects, setProjects] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [heroSettings, setHeroSettings] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<HeroData>(DEFAULT_HERO);
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0, projects: 0, certs: 0, subscribers: 0 });
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroMessage, setHeroMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('admin_auth');
    if (stored) setAuth(true);
  }, []);

  useEffect(() => {
    if (auth) loadData();
  }, [auth]);

  const loadData = async () => {
    const pwd = localStorage.getItem('admin_pwd') || password;
    const [p, c, s, h, cs, sl] = await Promise.all([
      fetchProjects(), fetchCertificates(), fetchSkills(), fetchHeroSettings(), fetchCaseStudies(), fetchSocialLinks()
    ]);
    setSocialLinks(sl || []);
    setProjects(p);
    setCerts(c);
    setSkills(s);
    setHeroSettings(h);
    setCaseStudies(cs);
    
    // Parse hero settings into heroData
    const newHeroData = { ...DEFAULT_HERO };
    if (Array.isArray(h)) {
      h.forEach((setting: any) => {
        if (setting.key === 'profile_image' && setting.image_url) {
          newHeroData.profile_image = setting.image_url;
        } else if (setting.key === 'hero_name') {
          newHeroData.name = setting.value || DEFAULT_HERO.name;
        } else if (setting.key === 'hero_title') {
          newHeroData.title = setting.value || DEFAULT_HERO.title;
        } else if (setting.key === 'hero_subtitle') {
          newHeroData.subtitle = setting.value || DEFAULT_HERO.subtitle;
        } else if (setting.key === 'hero_description') {
          newHeroData.description = setting.value || DEFAULT_HERO.description;
        } else if (setting.key === 'cta_primary_text') {
          newHeroData.cta_primary_text = setting.value || DEFAULT_HERO.cta_primary_text;
        } else if (setting.key === 'cta_primary_link') {
          newHeroData.cta_primary_link = setting.value || DEFAULT_HERO.cta_primary_link;
        } else if (setting.key === 'cta_secondary_text') {
          newHeroData.cta_secondary_text = setting.value || DEFAULT_HERO.cta_secondary_text;
        } else if (setting.key === 'cta_secondary_link') {
          newHeroData.cta_secondary_link = setting.value || DEFAULT_HERO.cta_secondary_link;
        } else if (setting.key === 'cv_button_text') {
          newHeroData.cv_button_text = setting.value || DEFAULT_HERO.cv_button_text;
        } else if (setting.key === 'cv_file') {
          newHeroData.cv_file = setting.value || DEFAULT_HERO.cv_file;
        }
      });
    }
    setHeroData(newHeroData);
    
    const viewCount = await getAnalyticsCount();
    const subs = await fetchSubscribers(pwd);
    setSubscribers(Array.isArray(subs) ? subs : []);
    setStats({ views: viewCount, projects: p.length, certs: c.length, subscribers: Array.isArray(subs) ? subs.length : 0 });
  };

  const handleLogin = async () => {
    const ok = await adminLogin(password);
    if (ok) {
      setAuth(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setAuth(false);
    localStorage.removeItem('admin_auth');
  };

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    const pwd = localStorage.getItem('admin_pwd') || password;
    
    if (editing.id) {
      await adminUpdate(editing.table, editing.id, editing.data, pwd);
    } else {
      await adminCreate(editing.table, editing.data, pwd);
    }
    
    await loadData();
    setEditing(null);
    setLoading(false);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Delete this item?')) return;
    const pwd = localStorage.getItem('admin_pwd') || password;
    await adminDelete(table, id, pwd);
    await loadData();
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    const pwd = localStorage.getItem('admin_pwd') || password;
    await deleteSubscriber(id, pwd);
    await loadData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const pwd = localStorage.getItem('admin_pwd') || password;
      const url = await uploadImage(reader.result as string, file.name, pwd);
      if (url) setEditing({ ...editing, data: { ...editing.data, image_url: url } });
    };
    reader.readAsDataURL(file);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async () => {
      const pwd = localStorage.getItem('admin_pwd') || password;
      const url = await uploadImage(reader.result as string, file.name, pwd);
      if (url) {
        setHeroData({ ...heroData, profile_image: url });
      }
    };
    reader.readAsDataURL(file);
  };

  const saveHeroSettings = async () => {
    setHeroSaving(true);
    setHeroMessage('');
    const pwd = localStorage.getItem('admin_pwd') || password;
    
    const settingsToSave = [
      { key: 'hero_name', value: heroData.name },
      { key: 'hero_title', value: heroData.title },
      { key: 'hero_subtitle', value: heroData.subtitle },
      { key: 'hero_description', value: heroData.description },
      { key: 'profile_image', value: 'Profile Image', image_url: heroData.profile_image },
      { key: 'cta_primary_text', value: heroData.cta_primary_text },
      { key: 'cta_primary_link', value: heroData.cta_primary_link },
      { key: 'cta_secondary_text', value: heroData.cta_secondary_text },
      { key: 'cta_secondary_link', value: heroData.cta_secondary_link },
      { key: 'cv_button_text', value: heroData.cv_button_text },
      { key: 'cv_file', value: heroData.cv_file },
    ];

    try {
      for (const setting of settingsToSave) {
        const existing = heroSettings.find((s: any) => s.key === setting.key);
        if (existing) {
          await adminUpdate('hero_settings', existing.id, setting, pwd);
        } else {
          await adminCreate('hero_settings', setting, pwd);
        }
      }
      await loadData();
      setHeroMessage('Hero settings saved successfully!');
      setTimeout(() => setHeroMessage(''), 3000);
    } catch (err) {
      setHeroMessage('Error saving settings. Please try again.');
    }
    setHeroSaving(false);
  };

  const loadGithubRepos = async () => {
    setSyncing(true);
    const pwd = localStorage.getItem('admin_pwd') || password;
    const repos = await fetchGithubRepos(pwd);
    setGithubRepos(repos || []);
    setSyncing(false);
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); localStorage.setItem('admin_pwd', e.target.value); }}
            placeholder="Enter admin password"
            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} className="btn-primary w-full justify-center">Login</button>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Eye },
    { key: 'hero', label: 'Hero', icon: Image },
    { key: 'projects', label: 'Projects', icon: Briefcase },
    { key: 'github', label: 'GitHub', icon: Github },
    { key: 'casestudies', label: 'Case Studies', icon: BookOpen },
    { key: 'certificates', label: 'Certificates', icon: Award },
    { key: 'skills', label: 'Skills', icon: Code2 },
    { key: 'newsletter', label: 'Newsletter', icon: Mail },
    { key: 'socials', label: 'Social Links', icon: Share2 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); if (t.key === 'github' && githubRepos.length === 0) loadGithubRepos(); }}
            className={`px-4 py-2 rounded-full capitalize flex items-center gap-2 text-sm ${tab === t.key ? 'bg-[var(--primary)] text-white' : 'glass-card !p-2 !px-4'}`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Eye, value: stats.views, label: 'Total Views' },
            { icon: Briefcase, value: stats.projects, label: 'Projects' },
            { icon: Award, value: stats.certs, label: 'Certificates' },
            { icon: Mail, value: stats.subscribers, label: 'Subscribers' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-glass)' }}>
                  <s.icon size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'hero' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Hero Section Settings</h2>
            <button 
              onClick={saveHeroSettings} 
              disabled={heroSaving}
              className="btn-primary"
            >
              <Save size={18} /> {heroSaving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
          
          {heroMessage && (
            <div className={`p-4 rounded-xl ${heroMessage.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
              {heroMessage}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Image Section */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Image size={20} style={{ color: 'var(--primary)' }} /> Profile Image
              </h3>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-royal-500/20 rounded-full blur-xl" />
                  <img 
                    src={heroData.profile_image} 
                    alt="Profile" 
                    className="relative w-full h-full rounded-full object-cover border-2 border-[var(--border-glass)]"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/profile.jpg'; }}
                  />
                </div>
                <label className="btn-primary cursor-pointer">
                  <Upload size={18} /> Upload New Image
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" />
                </label>
                <input 
                  placeholder="Or enter image URL" 
                  value={heroData.profile_image} 
                  onChange={e => setHeroData({ ...heroData, profile_image: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-sm"
                />
              </div>
            </div>

            {/* Preview Section */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Live Preview</h3>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-glass)' }}>
                <div className="text-xs px-2 py-1 rounded-full inline-block mb-2" style={{ background: 'var(--bg-glass)' }}>
                  {heroData.subtitle}
                </div>
                <h4 className="text-lg font-bold mb-1">
                  {heroData.title}{' '}
                  <span className="bg-gradient-to-r from-cyan-500 to-royal-500 bg-clip-text text-transparent">
                    {heroData.name}
                  </span>
                </h4>
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {heroData.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-[var(--primary)] text-white">
                    {heroData.cta_primary_text}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                    {heroData.cta_secondary_text}
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    {heroData.cv_button_text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content Section */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Type size={20} style={{ color: 'var(--primary)' }} /> Text Content
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Title Prefix</label>
                <input 
                  placeholder="Hi, I'm"
                  value={heroData.title}
                  onChange={e => setHeroData({ ...heroData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Your Name</label>
                <input 
                  placeholder="Ahmed Abdulhamid"
                  value={heroData.name}
                  onChange={e => setHeroData({ ...heroData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Subtitle / Role</label>
                <input 
                  placeholder="Front-End Developer & AI Specialist"
                  value={heroData.subtitle}
                  onChange={e => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea 
                  placeholder="I craft beautiful, intelligent web experiences..."
                  value={heroData.description}
                  onChange={e => setHeroData({ ...heroData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* CTA Buttons Section */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Link2 size={20} style={{ color: 'var(--primary)' }} /> Call-to-Action Buttons
            </h3>
            <div className="space-y-6">
              {/* Primary CTA */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-glass)' }}>
                <h4 className="text-sm font-medium mb-3">Primary Button</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Button Text</label>
                    <input 
                      placeholder="View My Work"
                      value={heroData.cta_primary_text}
                      onChange={e => setHeroData({ ...heroData, cta_primary_text: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Link (e.g., /projects)</label>
                    <input 
                      placeholder="/projects"
                      value={heroData.cta_primary_link}
                      onChange={e => setHeroData({ ...heroData, cta_primary_link: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-glass)' }}>
                <h4 className="text-sm font-medium mb-3">Secondary Button</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Button Text</label>
                    <input 
                      placeholder="Get In Touch"
                      value={heroData.cta_secondary_text}
                      onChange={e => setHeroData({ ...heroData, cta_secondary_text: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Link (e.g., /contact)</label>
                    <input 
                      placeholder="/contact"
                      value={heroData.cta_secondary_link}
                      onChange={e => setHeroData({ ...heroData, cta_secondary_link: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                </div>
              </div>

              {/* CV Button */}
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-glass)' }}>
                <h4 className="text-sm font-medium mb-3">CV/Resume Button</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Button Text</label>
                    <input 
                      placeholder="Download CV"
                      value={heroData.cv_button_text}
                      onChange={e => setHeroData({ ...heroData, cv_button_text: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>File Path (e.g., /resume.pdf)</label>
                    <input 
                      placeholder="/resume.pdf"
                      value={heroData.cv_file}
                      onChange={e => setHeroData({ ...heroData, cv_file: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'projects' && (
        <div>
          <button onClick={() => setEditing({ table: 'projects', data: { title: '', description: '', technologies: [], is_featured: false } })} className="btn-primary mb-6">
            <Plus size={18} /> Add Project
          </button>
          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{p.technologies?.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ table: 'projects', id: p.id, data: p })} className="p-2 rounded-lg hover:bg-[var(--bg-glass)]">Edit</button>
                  <button onClick={() => handleDelete('projects', p.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'github' && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={loadGithubRepos} disabled={syncing} className="btn-primary">
              <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} /> Fetch Repos
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {githubRepos.map(repo => (
              <div key={repo.id} className="glass-card p-4">
                <h3 className="font-semibold mb-2">{repo.name}</h3>
                <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{repo.description || 'No description'}</p>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-1"><Star size={14} /> {repo.stargazers_count}</span>
                  <span className="flex items-center gap-1"><GitFork size={14} /> {repo.forks_count}</span>
                  {repo.language && <span>{repo.language}</span>}
                </div>
              </div>
            ))}
          </div>
          {githubRepos.length === 0 && !syncing && (
            <div className="text-center py-12 glass-card">
              <Github size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Click "Fetch Repos" to load GitHub repositories</p>
            </div>
          )}
        </div>
      )}

      {tab === 'casestudies' && (
        <div>
          <button onClick={() => setEditing({ table: 'case_studies', data: { title: '', client: '', challenge: '', solution: '', results: '', technologies: [] } })} className="btn-primary mb-6">
            <Plus size={18} /> Add Case Study
          </button>
          <div className="space-y-4">
            {caseStudies.map(cs => (
              <div key={cs.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{cs.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{cs.client || 'No client'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ table: 'case_studies', id: cs.id, data: cs })} className="p-2 rounded-lg hover:bg-[var(--bg-glass)]">Edit</button>
                  <button onClick={() => handleDelete('case_studies', cs.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'certificates' && (
        <div>
          <button onClick={() => setEditing({ table: 'certificates', data: { name: '', issuer: '', issue_date: '' } })} className="btn-primary mb-6">
            <Plus size={18} /> Add Certificate
          </button>
          <div className="space-y-4">
            {certs.map(c => (
              <div key={c.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.issuer}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ table: 'certificates', id: c.id, data: c })} className="p-2 rounded-lg hover:bg-[var(--bg-glass)]">Edit</button>
                  <button onClick={() => handleDelete('certificates', c.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div>
          <button onClick={() => setEditing({ table: 'skills', data: { name: '', category: 'Frontend', proficiency: 80 } })} className="btn-primary mb-6">
            <Plus size={18} /> Add Skill
          </button>
          <div className="space-y-4">
            {skills.map(s => (
              <div key={s.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.category} - {s.proficiency}%</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ table: 'skills', id: s.id, data: s })} className="p-2 rounded-lg hover:bg-[var(--bg-glass)]">Edit</button>
                  <button onClick={() => handleDelete('skills', s.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'socials' && (
        <div>
          <button onClick={() => setEditing({ table: 'social_links', data: { platform: '', url: '', label: '', display_order: socialLinks.length + 1 } })} className="btn-primary mb-6">
            <Plus size={18} /> Add Social Link
          </button>
          <div className="space-y-4">
            {socialLinks.map(sl => (
              <div key={sl.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold capitalize">{sl.label || sl.platform}</h3>
                  <p className="text-sm truncate max-w-md" style={{ color: 'var(--text-secondary)' }}>{sl.url}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing({ table: 'social_links', id: sl.id, data: sl })} className="p-2 rounded-lg hover:bg-[var(--bg-glass)]">Edit</button>
                  <button onClick={() => handleDelete('social_links', sl.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
            {socialLinks.length === 0 && (
              <div className="text-center py-12 glass-card">
                <Share2 size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No social links configured</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'newsletter' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Newsletter Subscribers ({subscribers.length})</h2>
          <div className="space-y-4">
            {subscribers.map(sub => (
              <div key={sub.id} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{sub.email}</h3>
                    {sub.is_confirmed ? (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">Confirmed</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/20 text-yellow-400">Pending</span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{sub.name || 'No name'} - {new Date(sub.subscribed_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDeleteSubscriber(sub.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={18} /></button>
              </div>
            ))}
            {subscribers.length === 0 && (
              <div className="text-center py-12 glass-card">
                <Mail size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No subscribers yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editing.id ? 'Edit' : 'Add'} {editing.table.replace('_', ' ')}</h2>
            
            {editing.table === 'projects' && (
              <>
                <input placeholder="Title" value={editing.data.title || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, title: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <textarea placeholder="Description" value={editing.data.description || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, description: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={3} />
                <input placeholder="Technologies (comma separated)" value={editing.data.technologies?.join(', ') || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, technologies: e.target.value.split(',').map((t: string) => t.trim()) } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="Live URL" value={editing.data.live_url || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, live_url: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="GitHub URL" value={editing.data.github_url || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, github_url: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <label className="flex items-center gap-2 mb-4"><input type="checkbox" checked={editing.data.is_featured || false} onChange={e => setEditing({ ...editing, data: { ...editing.data, is_featured: e.target.checked } })} /> Featured</label>
              </>
            )}
            
            {editing.table === 'case_studies' && (
              <>
                <input placeholder="Title" value={editing.data.title || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, title: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="Client" value={editing.data.client || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, client: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <textarea placeholder="Challenge - What problem needed solving?" value={editing.data.challenge || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, challenge: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={3} />
                <textarea placeholder="Solution - How did you solve it?" value={editing.data.solution || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, solution: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={3} />
                <textarea placeholder="Results - What impact did it have?" value={editing.data.results || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, results: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={3} />
                <input placeholder="Technologies (comma separated)" value={editing.data.technologies?.join(', ') || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, technologies: e.target.value.split(',').map((t: string) => t.trim()) } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--border-glass)' }}>
                  <h4 className="font-semibold mb-3">Before/After Comparison</h4>
                  <input placeholder="Before Image URL" value={editing.data.before_image || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, before_image: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                  <textarea placeholder="Before Description" value={editing.data.before_description || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, before_description: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={2} />
                  <input placeholder="After Image URL" value={editing.data.after_image || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, after_image: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                  <textarea placeholder="After Description" value={editing.data.after_description || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, after_description: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" rows={2} />
                </div>
              </>
            )}
            
            {editing.table === 'certificates' && (
              <>
                <input placeholder="Name" value={editing.data.name || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, name: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="Issuer" value={editing.data.issuer || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, issuer: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input type="date" value={editing.data.issue_date || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, issue_date: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="Credential URL" value={editing.data.credential_url || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, credential_url: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
              </>
            )}
            
            {editing.table === 'skills' && (
              <>
                <input placeholder="Skill Name" value={editing.data.name || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, name: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <select value={editing.data.category || 'Frontend'} onChange={e => setEditing({ ...editing, data: { ...editing.data, category: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4">
                  <option value="Frontend">Frontend</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
                <input type="number" placeholder="Proficiency %" min="0" max="100" value={editing.data.proficiency || 80} onChange={e => setEditing({ ...editing, data: { ...editing.data, proficiency: parseInt(e.target.value) } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
              </>
            )}

            {editing.table === 'social_links' && (
              <>
                <select value={editing.data.platform || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, platform: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4">
                  <option value="">Select Platform</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="twitter">Twitter/X</option>
                </select>
                <input placeholder="Label (e.g., TikTok)" value={editing.data.label || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, label: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input placeholder="URL" value={editing.data.url || ''} onChange={e => setEditing({ ...editing, data: { ...editing.data, url: e.target.value } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
                <input type="number" placeholder="Display Order" value={editing.data.display_order || 1} onChange={e => setEditing({ ...editing, data: { ...editing.data, display_order: parseInt(e.target.value) } })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] mb-4" />
              </>
            )}

            {['projects', 'certificates', 'case_studies'].includes(editing.table) && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full" />
                {editing.data.image_url && <img src={editing.data.image_url} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl" />}
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={handleSave} disabled={loading} className="btn-primary flex-1 justify-center">
                <Save size={18} /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(null)} className="btn-primary !bg-transparent border flex-1 justify-center" style={{ borderColor: 'var(--border-glass)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
