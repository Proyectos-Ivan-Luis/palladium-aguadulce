'use client';

import React, { useState } from 'react';

export default function Faq({ faq }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  // 5 diapositivas / placeholders de fotos para importar
  const totalSlides = 5;

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="section section-alt" id="faq">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="text-caption" style={{ color: 'var(--black)' }}>
            {faq.sectionLabel}
          </span>
          <h2 className="heading-section">{faq.title}</h2>
        </div>

        {/* Layout Grid responsivo de 2 columnas */}
        <div className="faq-grid-container">
          {/* Columna Izquierda: Preguntas Frecuentes Acordeón */}
          <div className="faq-col-accordion">
            <div className="faq-list">
              {faq.items.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`faq-item ${isActive ? 'active' : ''}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleAccordion(idx)}
                      aria-expanded={isActive}
                    >
                      {item.question}
                      <span className="faq-icon" />
                    </button>

                    <div className="faq-answer">
                      <div className="faq-answer-inner">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Carrusel interactivo de 5 fotos */}
          <div className="faq-col-carousel">
            <div className="faq-carousel-wrapper">
              <div className="faq-carousel-inner">
                {(() => {
                  // Definimos las 5 fotos reales a mostrar consecutivamente
                  const slideImages = [
                    "/assets/images/palladiumfotostock3.jpeg",
                    "/assets/images/palladiumfotostock5.jpeg",
                    "/assets/images/palladiumfotostock2.jpeg",
                    "/assets/images/palladiumfotostock1.jpeg",
                    "/assets/images/palladiumfotostock4pa.jpeg"
                  ];

                  return slideImages.map((src, idx) => {
                    const isActive = activeSlide === idx;
                    return (
                      <div
                        key={idx}
                        className={`faq-carousel-slide ${isActive ? 'active' : ''}`}
                        style={{
                          display: isActive ? 'block' : 'none',
                          height: '100%',
                          backgroundColor: '#0A0A0A',
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 'var(--radius-lg)'
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`Alumnos de la academia Palladium bailando - Foto ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'grayscale(100%) contrast(1.1) brightness(0.65)'
                          }}
                        />
                        {/* Sutil overlay degradado acromático */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.65))',
                            pointerEvents: 'none'
                          }}
                        />
                        {/* Leyenda minimalista en cada slide */}
                        <div style={{ position: 'absolute', bottom: '28px', left: '16px', right: '16px', zIndex: 1 }}>
                          <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.7rem',
                            color: 'rgba(255,255,255,0.85)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            fontWeight: '600',
                            backgroundColor: 'rgba(0,0,0,0.45)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            Galería Palladium - Foto {idx + 1}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Botones de navegación del carrusel */}
              <button
                className="faq-carousel-btn prev"
                onClick={prevSlide}
                aria-label="Foto anterior"
              >
                ‹
              </button>
              <button
                className="faq-carousel-btn next"
                onClick={nextSlide}
                aria-label="Siguiente foto"
              >
                ›
              </button>

              {/* Indicadores de puntitos */}
              <div className="faq-carousel-dots">
                {[...Array(totalSlides)].map((_, idx) => (
                  <button
                    key={idx}
                    className={`faq-carousel-dot ${activeSlide === idx ? 'active' : ''}`}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Ir a foto ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
