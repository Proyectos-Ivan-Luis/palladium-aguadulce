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

        {/* Botón intermedio: Conoce nuestros eventos (Estilo outline oscuro para fondo claro) */}
        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2.5rem' }}>
          <a
            href="https://palladiumsalsa.es/eventos/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn hero-web-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1.5px solid var(--black)',
              color: 'var(--black)',
              background: 'transparent',
              padding: '0.65rem 1.4rem',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              transition: 'all var(--transition-fast)'
            }}
          >
            Conoce nuestros eventos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginLeft: '8px' }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
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
            src="/assets/images/palladiumfotostock5.jpeg"
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

        {/* Bloque de Reseñas de Google Premium */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.02)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: 'var(--space-md)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Cabecera de Google Reviews */}
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingBottom: '1.25rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--gray-200)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Google G Logo */}
              <svg viewBox="0 0 24 24" width="36" height="36" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  margin: 0,
                  color: 'var(--black)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  Opiniones en Google <span style={{ color: '#F4B400', fontSize: '1.2rem', fontWeight: '800' }}>★ 5.0</span>
                </h3>
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--gray-600)',
                  margin: '1px 0 0 0',
                  fontWeight: '500'
                }}>
                  Excelente reputación basada en alumnos reales
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="#F4B400">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--gray-400)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                100% de valoraciones con 5 estrellas
              </span>
            </div>
          </div>

          {/* Rejilla de Reseñas de Google */}
          <div className="testimonials">
            {socialProof.testimonials.map((t, idx) => {
              // Asignar colores de avatar de Google vibrantes
              let avatarBg = '#4285F4'; // Google Blue
              if (t.author.startsWith('E')) avatarBg = '#34A853'; // Google Green
              if (t.author.startsWith('S')) avatarBg = '#EA4335'; // Google Red
              if (t.author.startsWith('J')) avatarBg = '#FBBC05'; // Google Yellow
              
              const firstLetter = t.author ? t.author.charAt(0).toUpperCase() : 'G';
              const isLocalGuide = t.role === 'Local Guide';

              return (
                <div key={idx} className="testimonial-card" style={{
                  background: 'var(--white)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)'
                }}>
                  <div>
                    {/* Fila superior: Avatar, Nombre y Detalle de Google */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: avatarBg,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.05rem',
                        fontFamily: 'var(--font-body)',
                        flexShrink: 0
                      }}>
                        {firstLetter}
                      </div>
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: 'var(--black)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {t.author}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          {isLocalGuide ? (
                            <span style={{
                              fontSize: '0.72rem',
                              color: '#E37400', // Google Local Guide Orange
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}>
                              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                              </svg>
                              Local Guide
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: '500' }}>
                              Opinión de Google
                            </span>
                          )}
                          <span style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: '400' }}>
                            • {idx === 0 ? 'Hace 2 semanas' : idx === 1 ? 'Hace 1 mes' : 'Hace 3 semanas'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Icono Google "G" pequeño a la derecha */}
                      <svg viewBox="0 0 24 24" width="14" height="14" style={{ alignSelf: 'flex-start', flexShrink: 0, opacity: 0.7 }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    </div>

                    {/* Fila de Estrellas de Google */}
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.6rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" width="14" height="14" fill="#F4B400">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    {/* Texto de la reseña con pre-line */}
                    <p className="testimonial-text" style={{
                      fontSize: '0.88rem',
                      lineHeight: '1.6',
                      color: 'var(--gray-600)',
                      fontStyle: 'normal',
                      whiteSpace: 'pre-line',
                      margin: 0
                    }}>
                      "{t.text}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div> {/* Cierre del container principal */}

      {/* Banner Promocional Prueba Social (Tira de Ancho Completo) */}
      <div className="promo-banner-social-strip" style={{
        width: '100%',
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: 'var(--shadow-sm)',
        padding: '0.9rem 1rem',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        margin: '3.5rem 0 2rem 0'
      }}>
        <span style={{
          background: 'var(--accent-whatsapp)',
          color: '#FFFFFF',
          padding: '3px 10px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>CLASE DE PRUEBA</span>
        <span style={{
          fontSize: '1.05rem',
          fontWeight: '600',
          color: 'var(--black)',
          lineHeight: '1.4'
        }}>
          Ven, baila y decide. <strong>¡Primera clase 100% gratuita!</strong>
        </span>
      </div>

      <div className="container">
        {/* Botón de conversión intermedio */}
        <div style={{ textAlign: 'center', marginTop: '0' }}>
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