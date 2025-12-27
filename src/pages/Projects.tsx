import { useEffect, useState } from 'react';
import { trackPageView, fetchProjects } from '../lib/supabase';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    trackPageView('projects');
    fetchProjects().then(p => {
      setProjects(p);
      const cats = [...new Set(p.flatMap((x: any) => x.technologies || []))];
      setCategories(cats.slice(0, 5) as string[]);
    });
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter(p => p.technologies?.includes(filter));

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-up">My Projects</h1>
      <p className="text-lg mb-8 fade-in-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
        A collection of projects showcasing my skills in front-end development and AI integration.
      </p>

      <div className="flex flex-wrap gap-2 mb-12 fade-in-up" style={{ animationDelay: '0.2s' }}>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all' ? 'bg-[var(--primary)] text-white' : 'glass-card !p-2 !px-4'
          }`}
        >
          All Projects
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat ? 'bg-[var(--primary)] text-white' : 'glass-card !p-2 !px-4'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((p, i) => (
          <div key={p.id} className="fade-in-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 glass-card">
          <p style={{ color: 'var(--text-secondary)' }}>No projects found in this category.</p>
        </div>
      )}
    </div>
  );
}
