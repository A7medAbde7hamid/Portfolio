import { useEffect } from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Download } from 'lucide-react';
import { trackPageView } from '../lib/supabase';

const experiences = [
  { title: 'Front-End Developer', company: 'Freelance', period: '2022 - Present', desc: 'Building modern web applications using React, TypeScript, and TailwindCSS' },
  { title: 'AI Integration Specialist', company: 'Projects', period: '2023 - Present', desc: 'Integrating AI/ML models into web applications for enhanced user experiences' },
];

const education = [
  { degree: 'Computer Science Studies', school: 'University', period: '2020 - Present', desc: 'Focus on software engineering and artificial intelligence' },
];

export default function About() {
  useEffect(() => { trackPageView('about'); }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 fade-in-up">About Me</h1>
      
      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 glass-card p-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-semibold mb-4">My Journey</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            I am a passionate Front-End Developer with expertise in React, TypeScript, and AI/ML integration. 
            My journey in tech started with a curiosity about how websites work, which evolved into a deep 
            passion for creating beautiful, performant web applications.
          </p>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Today, I specialize in building modern web experiences that blend cutting-edge technology with 
            exceptional user interfaces. My background in AI allows me to create intelligent applications 
            that provide unique value to users.
          </p>
          
          {/* Resume Download Button */}
          <a 
            href="/resume.pdf" 
            download="Ahmed_Abdulhamid_Resume.pdf"
            className="btn-primary inline-flex items-center gap-2 transition-all hover:scale-105"
          >
            <Download size={18} /> Download My Resume
          </a>
        </div>
        
        <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-semibold mb-4">Quick Facts</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Based in Egypt</span>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>3+ Years Experience</span>
            </div>
            <div className="flex items-center gap-3">
              <Award size={20} style={{ color: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>10+ Projects Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Briefcase style={{ color: 'var(--primary)' }} /> Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--bg-glass)', color: 'var(--primary)' }}>{exp.period}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--primary)' }}>{exp.company}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <GraduationCap style={{ color: 'var(--primary)' }} /> Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{edu.degree}</h3>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--bg-glass)', color: 'var(--primary)' }}>{edu.period}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: 'var(--primary)' }}>{edu.school}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{edu.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
