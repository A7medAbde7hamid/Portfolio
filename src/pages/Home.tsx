import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Code2, Brain, Sparkles, Download } from 'lucide-react';
import { fetchProjects, fetchSkills, trackPageView, getAnalyticsCount, fetchHeroSettings } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';
import Newsletter from '../components/Newsletter';
import Testimonials from '../components/Testimonials';

// Default hero data
const DEFAULT_HERO = {
  name: 'Ahmed Abdulhamid',
  title: "Hi, I'm",
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

// Animated particles component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-royal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [views, setViews] = useState(0);
  const [hero, setHero] = useState(DEFAULT_HERO);

  useEffect(() => {
    trackPageView('home');
    fetchProjects().then(p => setProjects(p.filter((x: any) => x.is_featured).slice(0, 3)));
    fetchSkills().then(setSkills);
    getAnalyticsCount().then(setViews);
    
    // Load hero settings
    fetchHeroSettings().then(settings => {
      if (Array.isArray(settings) && settings.length > 0) {
        const newHero = { ...DEFAULT_HERO };
        settings.forEach((s: any) => {
          switch (s.key) {
            case 'profile_image':
              if (s.image_url) newHero.profile_image = s.image_url;
              break;
            case 'hero_name':
              if (s.value) newHero.name = s.value;
              break;
            case 'hero_title':
              if (s.value) newHero.title = s.value;
              break;
            case 'hero_subtitle':
              if (s.value) newHero.subtitle = s.value;
              break;
            case 'hero_description':
              if (s.value) newHero.description = s.value;
              break;
            case 'cta_primary_text':
              if (s.value) newHero.cta_primary_text = s.value;
              break;
            case 'cta_primary_link':
              if (s.value) newHero.cta_primary_link = s.value;
              break;
            case 'cta_secondary_text':
              if (s.value) newHero.cta_secondary_text = s.value;
              break;
            case 'cta_secondary_link':
              if (s.value) newHero.cta_secondary_link = s.value;
              break;
            case 'cv_button_text':
              if (s.value) newHero.cv_button_text = s.value;
              break;
            case 'cv_file':
              if (s.value) newHero.cv_file = s.value;
              break;
          }
        });
        setHero(newHero);
      }
    });
  }, []);

  // Check if link is external or internal
  const isExternalLink = (url: string) => url.startsWith('http://') || url.startsWith('https://');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 min-h-[90vh] flex items-center">
        <AnimatedBackground />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text Content */}
          <div className="fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card !p-2 !px-4 mb-6">
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{hero.subtitle}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {hero.title}{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-royal-500 bg-clip-text text-transparent">
                {hero.name}
              </span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              {hero.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Primary CTA */}
              {isExternalLink(hero.cta_primary_link) ? (
                <a href={hero.cta_primary_link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  {hero.cta_primary_text} <ArrowRight size={18} />
                </a>
              ) : (
                <Link to={hero.cta_primary_link} className="btn-primary">
                  {hero.cta_primary_text} <ArrowRight size={18} />
                </Link>
              )}
              
              {/* Secondary CTA */}
              {isExternalLink(hero.cta_secondary_link) ? (
                <a 
                  href={hero.cta_secondary_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary !bg-transparent border-2" 
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  {hero.cta_secondary_text}
                </a>
              ) : (
                <Link 
                  to={hero.cta_secondary_link} 
                  className="btn-primary !bg-transparent border-2" 
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  {hero.cta_secondary_text}
                </Link>
              )}
              
              {/* CV Download Button */}
              <a 
                href={hero.cv_file} 
                download
                className="btn-primary !bg-transparent border-2 hover:!bg-[var(--primary)] hover:!text-white transition-all"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                <Download size={18} /> {hero.cv_button_text}
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center gap-2">
                <Eye size={18} style={{ color: 'var(--primary)' }} />
                <span>{views.toLocaleString()} Page Views</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 size={18} style={{ color: 'var(--primary)' }} />
                <span>{projects.length}+ Projects</span>
              </div>
            </div>
          </div>

          {/* Right: Profile Image */}
          <div className="fade-in-up hidden lg:flex justify-center" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 -m-4 rounded-full border-2 border-cyan-500/20 animate-spin-slow" />
              <div className="absolute inset-0 -m-8 rounded-full border border-royal-500/10" />
              <div className="absolute inset-0 -m-12 rounded-full border border-cyan-500/5" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-royal-500/20 rounded-full blur-2xl" />
              
              {/* Image container */}
              <div className="relative w-80 h-80 rounded-full overflow-hidden glass-card !p-1">
                <img
                  src={hero.profile_image}
                  alt={hero.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/profile.jpg';
                  }}
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -right-4 top-1/4 glass-card !p-3 animate-bounce-slow">
                <Code2 size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="absolute -left-4 bottom-1/4 glass-card !p-3 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                <Brain size={24} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <Link to="/projects" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Skills Ticker */}
      <section className="py-16 overflow-hidden">
        <div className="flex gap-8 animate-scroll">
          {[...skills, ...skills].map((s, i) => (
            <div key={i} className="glass-card !p-4 flex items-center gap-3 whitespace-nowrap">
              <Brain size={20} style={{ color: 'var(--primary)' }} />
              <span className="font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Newsletter />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-24">
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Work Together</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Have a project in mind? Let's create something amazing.</p>
          <Link to="/contact" className="btn-primary">
            Start a Conversation <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
