import { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchTestimonials } from '../lib/supabase';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image_url?: string;
  image?: string;
  content: string;
  rating: number;
}

// Fallback testimonials when database is empty or unavailable
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: 'Ahmed delivered exceptional work on our web application. His attention to detail and technical expertise exceeded our expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager, InnovateCo',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'Working with Ahmed was a great experience. He understood our requirements perfectly and delivered a stunning, responsive website.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Founder, DesignHub',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Ahmed is a talented developer who brings creativity and professionalism to every project. Highly recommended!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'CTO, DataFlow',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    content: 'The AI integration Ahmed implemented for our platform was outstanding. He has deep knowledge of both frontend and AI technologies.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    // Fetch from database, fallback to hardcoded if unavailable
    fetchTestimonials().then(data => {
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentItem = testimonials[current];
  const imageUrl = currentItem.image_url || currentItem.image;

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Clients Say</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Feedback from people I have worked with</p>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden">
          <Quote
            size={80}
            className="absolute top-4 left-4 opacity-10"
            style={{ color: 'var(--primary)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-1 justify-center mb-6">
              {[...Array(currentItem.rating)].map((_, i) => (
                <Star key={i} size={20} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
              ))}
            </div>

            <p className="text-lg md:text-xl text-center mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              "{currentItem.content}"
            </p>

            <div className="flex items-center justify-center gap-4">
              <img
                src={imageUrl}
                alt={currentItem.name}
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: 'var(--primary)' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop';
                }}
              />
              <div className="text-left">
                <p className="font-semibold">{currentItem.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {currentItem.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrent(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6' : ''
                }`}
                style={{
                  background: i === current ? 'var(--primary)' : 'var(--border-glass)',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
