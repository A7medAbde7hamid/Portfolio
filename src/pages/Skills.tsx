import { useEffect, useState } from 'react';
import { trackPageView, fetchSkills } from '../lib/supabase';
import SkillBar from '../components/SkillBar';
import { Code2, Brain, Wrench, Users } from 'lucide-react';

const softSkills = [
  { name: 'Problem Solving', icon: Brain },
  { name: 'Communication', icon: Users },
  { name: 'Team Collaboration', icon: Users },
  { name: 'Quick Learning', icon: Brain },
];

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    trackPageView('skills');
    fetchSkills().then(setSkills);
  }, []);

  const grouped = skills.reduce((acc: any, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryIcons: any = { Frontend: Code2, 'AI/ML': Brain, Tools: Wrench };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-up">Skills & Expertise</h1>
      <p className="text-lg mb-12 fade-in-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
        My technical toolkit and professional capabilities.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {Object.entries(grouped).map(([category, categorySkills], i) => {
          const Icon = categoryIcons[category] || Code2;
          return (
            <div key={category} className="glass-card p-8 fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Icon style={{ color: 'var(--primary)' }} />
                {category}
              </h2>
              {(categorySkills as any[]).map(skill => (
                <SkillBar key={skill.id} skill={skill} />
              ))}
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-semibold mb-8 fade-in-up">Soft Skills</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {softSkills.map(({ name, icon: Icon }, i) => (
          <div key={name} className="glass-card p-6 text-center fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-glass)' }}>
              <Icon size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="font-medium">{name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
