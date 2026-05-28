'use client';

import React, { useState, useEffect, useRef } from 'react';

function Counter({ endValue, suffix }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const duration = 2000; // 2 segundos
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Función de easing out cuadratica
            const easeOutQuad = progress * (2 - progress);
            const currentValue = Math.floor(easeOutQuad * endValue);
            
            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(endValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [endValue]);

  // Formatear número con separador de miles
  const formattedCount = count.toLocaleString('es-ES');

  return (
    <div className="counter-item" ref={elementRef}>
      <div className="counter-number">
        {formattedCount}
        {suffix}
      </div>
    </div>
  );
}

export default function SocialProof({ socialProof }) {
  return (
    <section className="section section-alt" id="comunidad">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="text-caption" style={{ color: 'var(--accent-cta)' }}>
            {socialProof.sectionLabel}
          </span>
          <h2 className="heading-section">{socialProof.title}</h2>
        </div>

        {/* Bloque de contadores animados premium */}
        <div className="counters">
          {socialProof.counters.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Counter endValue={c.number} suffix={c.suffix} />
              <div className="counter-label">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Foto de la comunidad real en escala de grises */}
        <div 
          style={{
            width: '100%',
            height: '340px',
            backgroundColor: '#0A0A0A',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--space-xl)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
            border: '1px solid var(--gray-200)'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/images/imagen-bachata-2.jpg" 
            alt="Comunidad Palladium bailando salsa y bachata" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.1) brightness(0.65)',
              position: 'absolute',
              inset: 0
            }}
          />
          {/* Overlay gradiente premium B&W */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.75))',
              pointerEvents: 'none'
            }}
          />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'left', padding: '1.5rem', width: '100%' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: '600',
              borderLeft: '2px solid var(--white)',
              paddingLeft: '10px'
            }}>
              Nuestra gran familia Palladium en Almería
            </span>
          </div>
        </div>

        {/* Testimonios Reales de Alumnos de Google Reviews */}
        <div className="testimonials">
          {socialProof.testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div>
                <h4 className="testimonial-author">{t.author}</h4>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de conversión intermedio */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <a 
            href="#hero-form-section" 
            className="btn btn-cta"
          >
            Únete a la familia Palladium
          </a>
        </div>
      </div>
    </section>
  );
}
