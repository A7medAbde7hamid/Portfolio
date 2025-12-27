import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  image_url?: string;
}

// Default project images for projects without custom images
const defaultImages = [
  '/images/projects/web-dashboard.jpg',
  '/images/projects/responsive-design.jpg',
  '/images/projects/ai-interface.jpg',
  '/images/projects/design-gallery.jpg',
];

export default function ProjectCard({ project }: { project: Project }) {
  // Use project image or fallback to a default based on project id
  const imageUrl = project.image_url || defaultImages[project.id % defaultImages.length];

  return (
    <div className="glass-card overflow-hidden group transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[var(--glow-color)]">
      <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-royal-500/20 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Fallback to gradient with letter if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Glow border effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 border-2 border-[var(--primary)] rounded-t-2xl" style={{ boxShadow: 'inset 0 0 30px var(--glow-color)' }} />
        </div>
        
        {/* Action buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          {project.live_url && (
            <a 
              href={project.live_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary !py-2 !px-4 transform hover:scale-110 transition-transform"
            >
              <ExternalLink size={16} /> Live
            </a>
          )}
          {project.github_url && (
            <a 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary !py-2 !px-4 !bg-slate-700 transform hover:scale-110 transition-transform"
            >
              <Github size={16} /> Code
            </a>
          )}
        </div>
      </div>
      
      <div className="p-6 relative">
        {/* Animated underline */}
        <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] group-hover:w-full transition-all duration-500" />
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech: string, i: number) => (
            <span 
              key={tech} 
              className="text-xs px-3 py-1 rounded-full font-mono transition-all duration-300 hover:scale-105"
              style={{ 
                background: 'var(--bg-glass)', 
                color: 'var(--primary)',
                transitionDelay: `${i * 50}ms`
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
