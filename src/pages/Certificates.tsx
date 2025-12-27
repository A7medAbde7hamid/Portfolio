import { useEffect, useState } from 'react';
import { trackPageView, fetchCertificates } from '../lib/supabase';
import { ExternalLink, Award, X } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    trackPageView('certificates');
    fetchCertificates().then(setCerts);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 fade-in-up">Certificates</h1>
      <p className="text-lg mb-12 fade-in-up" style={{ color: 'var(--text-secondary)', animationDelay: '0.1s' }}>
        Professional certifications and achievements validating my expertise.
      </p>

      {certs.length === 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { img: '/images/certificates/cert1.jpg', title: 'Professional Achievement', issuer: 'Industry Academy', year: '2024' },
            { img: '/images/certificates/cert2.jpg', title: 'Digital Transformation', issuer: 'MIT Professional Education', year: '2024' },
            { img: '/images/certificates/cert3.jpg', title: 'Excellence Award', issuer: 'Tech Institute', year: '2024' }
          ].map((cert, i) => (
            <div key={i} className="glass-card p-6 fade-in-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <img src={cert.img} alt={cert.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{cert.title}</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Issued by {cert.issuer} - {cert.year}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Add real certificates via the Admin panel.
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, i) => (
            <div
              key={cert.id}
              className="glass-card p-6 cursor-pointer fade-in-up"
              style={{ animationDelay: `${0.1 * i}s` }}
              onClick={() => setSelected(cert)}
            >
              {cert.image_url ? (
                <img src={cert.image_url} alt={cert.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              ) : (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-glass)' }}>
                  <Award size={32} style={{ color: 'var(--primary)' }} />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {cert.issuer} - {cert.issue_date ? new Date(cert.issue_date).getFullYear() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="glass-card max-w-2xl w-full p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-glass)]">
              <X size={24} />
            </button>
            {selected.image_url && (
              <img src={selected.image_url} alt={selected.name} className="w-full rounded-xl mb-6" />
            )}
            <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              Issued by {selected.issuer} {selected.issue_date && `on ${new Date(selected.issue_date).toLocaleDateString()}`}
            </p>
            {selected.credential_url && (
              <a href={selected.credential_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Verify Credential <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
