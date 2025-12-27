import { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Target, Lightbulb, TrendingUp, ArrowLeftRight } from 'lucide-react';
import { trackPageView, fetchCaseStudies } from '../lib/supabase';

export default function CaseStudies() {
  const [studies, setStudies] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [compareView, setCompareView] = useState<'before' | 'after'>('before');

  useEffect(() => {
    trackPageView('case-studies');
    fetchCaseStudies().then(setStudies);
  }, []);

  const hasComparison = (study: any) => study.before_image || study.after_image || study.before_description || study.after_description;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card !p-2 !px-4 mb-4">
          <BookOpen size={16} style={{ color: 'var(--primary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>In-Depth Analysis</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Detailed breakdowns of projects showcasing challenges, solutions, and measurable results.
        </p>
      </div>

      {studies.length === 0 ? (
        <div className="text-center py-16 glass-card fade-in-up">
          <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Case studies coming soon!</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Detailed project breakdowns will be available here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {studies.map((study, i) => (
            <div key={study.id} className="glass-card overflow-hidden fade-in-up group cursor-pointer" style={{ animationDelay: `${0.1 * i}s` }} onClick={() => { setSelected(study); setCompareView('before'); }}>
              {study.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={study.image_url} alt={study.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{study.title}</h3>
                  {study.client && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{study.client}</span>}
                </div>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{study.challenge}</p>
                {study.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.technologies.slice(0, 4).map((tech: string) => (
                      <span key={tech} className="px-2 py-1 rounded-full text-xs" style={{ background: 'var(--bg-glass)' }}>{tech}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--primary)' }}>
                    Read Case Study <ArrowRight size={16} />
                  </button>
                  {hasComparison(study) && (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-glass)', color: 'var(--primary)' }}>
                      <ArrowLeftRight size={12} /> Before/After
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            {selected.client && <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Client: {selected.client}</p>}
            
            {selected.image_url && <img src={selected.image_url} alt={selected.title} className="w-full h-64 object-cover rounded-xl mb-6" />}
            
            {/* Before/After Comparison */}
            {hasComparison(selected) && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <ArrowLeftRight size={18} style={{ color: 'var(--primary)' }} />
                    Before / After Comparison
                  </h4>
                  <div className="flex rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
                    <button 
                      onClick={() => setCompareView('before')}
                      className={`px-4 py-2 text-sm font-medium transition-all ${compareView === 'before' ? 'bg-[var(--primary)] text-white' : ''}`}
                    >
                      Before
                    </button>
                    <button 
                      onClick={() => setCompareView('after')}
                      className={`px-4 py-2 text-sm font-medium transition-all ${compareView === 'after' ? 'bg-[var(--primary)] text-white' : ''}`}
                    >
                      After
                    </button>
                  </div>
                </div>
                
                <div className="glass-card p-4 transition-all">
                  {compareView === 'before' ? (
                    <>
                      {selected.before_image && (
                        <img src={selected.before_image} alt="Before" className="w-full h-48 object-cover rounded-lg mb-3" />
                      )}
                      <p style={{ color: 'var(--text-secondary)' }}>{selected.before_description || 'No before description available.'}</p>
                    </>
                  ) : (
                    <>
                      {selected.after_image && (
                        <img src={selected.after_image} alt="After" className="w-full h-48 object-cover rounded-lg mb-3" />
                      )}
                      <p style={{ color: 'var(--text-secondary)' }}>{selected.after_description || 'No after description available.'}</p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2"><Target size={18} style={{ color: 'var(--primary)' }} /><h4 className="font-semibold">Challenge</h4></div>
                <p style={{ color: 'var(--text-secondary)' }}>{selected.challenge || 'N/A'}</p>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2"><Lightbulb size={18} style={{ color: 'var(--primary)' }} /><h4 className="font-semibold">Solution</h4></div>
                <p style={{ color: 'var(--text-secondary)' }}>{selected.solution || 'N/A'}</p>
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2"><TrendingUp size={18} style={{ color: 'var(--primary)' }} /><h4 className="font-semibold">Results</h4></div>
                <p style={{ color: 'var(--text-secondary)' }}>{selected.results || 'N/A'}</p>
              </div>
            </div>

            {selected.technologies?.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.technologies.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 rounded-full text-sm" style={{ background: 'var(--bg-glass)' }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setSelected(null)} className="btn-primary mt-8 w-full justify-center">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
