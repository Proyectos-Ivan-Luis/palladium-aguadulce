'use client';

import React, { useState } from 'react';

export default function Hero({ hero, discipline, sharedLocations }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    ubicacion: sharedLocations[0]?.name || 'Roquetas de Mar'
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellidos || !formData.telefono) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          telefono: formData.telefono,
          ubicacion: formData.ubicacion,
          disciplina: discipline || 'Salsa'
        })
      });

      if (!response.ok) {
        throw new Error('Error en el servidor al enviar los datos');
      }

      setStatus('success');

      // Disparar evento de conversión de Google Ads si estuviera configurado
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/LABEL',
          'value': 1.0,
          'currency': 'EUR'
        });
      }
    } catch (error) {
      console.error('Error al registrar lead:', error);
      alert('Hubo un problema al reservar tu plaza. Por favor, inténtalo de nuevo.');
      setStatus('idle');
    }
  };

  return (
    <section className="hero" id="hero-form-section">
      <div className="hero-bg" style={{ backgroundColor: '#0A0A0A', position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
        {/* Patrón de cuadrícula / Grid acromático de fondo constante */}
        <div
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px',
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        />
        {/* Imagen de fondo real si está definida, superpuesta en zIndex 2 */}
        {hero.backgroundImage && (
          <div
            className="hero-bg-image"
            style={{
              backgroundImage: `url("${hero.backgroundImage}")`,
              position: 'absolute',
              inset: 0,
              backgroundSize: 'cover',
              zIndex: 2
            }}
          />
        )}

        {/* Leyenda discreta de fondo premium si no hay foto */}
        {!hero.backgroundImage && (
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            color: 'rgba(255, 255, 255, 0.15)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            borderLeft: '1px solid rgba(255,255,255,0.15)',
            paddingLeft: '10px',
            pointerEvents: 'none',
            zIndex: 3
          }}>
            HUECO DISPONIBLE PARA IMAGEN DE FONDO DE {discipline.toUpperCase()}
          </div>
        )}
      </div>

      {/* El overlay debe estar en zIndex 3 pero detras del contenido (que estará en zIndex 10) */}
      <div className="hero-overlay" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.65))', position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}></div>

      {/* Banner Promocional Superior (Tira de Ancho Completo Absoluta) */}
      <div className="promo-banner-top-strip" style={{
        position: 'absolute',
        top: '70px',
        left: 0,
        right: 0,
        background: '#000000',
        borderBottom: '1.5px solid rgba(255,255,255,0.12)',
        color: '#FFFFFF',
        textAlign: 'center',
        padding: '0.85rem 1rem',
        fontSize: '1.05rem',
        fontWeight: '600',
        letterSpacing: '0.04em',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.25)',
        flexWrap: 'wrap'
      }}>
        <span style={{
          background: '#FFAA00',
          color: '#000000',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>PROMO INICIO</span>
        <span>Empieza a bailar a mitad de precio. <strong>¡50% de descuento en tu primer mes!</strong></span>
      </div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-text">
          <span className="text-caption" style={{ color: 'var(--gray-200)', marginBottom: '1rem', display: 'inline-block' }}>
            Aprende con los mejores
          </span>
          <h1>
            {hero.heading} <em>{hero.headingAccent}</em> {hero.headingSuffix}
          </h1>
          <h2>{hero.subheading}</h2>
          <div style={{ marginBottom: '2.2rem' }}>
            <a
              href="https://palladiumsalsa.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn hero-web-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid var(--white)',
                color: 'var(--white)',
                background: 'transparent',
                padding: '0.8rem 1.6rem',
                fontSize: '0.95rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                transition: 'all var(--transition-fast)'
              }}
            >
              Visita nuestra web
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
        </div>

        <div className="hero-form-wrapper">
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--black)' }}>
                ¡Plaza Reservada!
              </h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Hemos recibido tus datos correctamente. Un asesor de Palladium se pondrá en contacto contigo en las próximas 24 horas para confirmar tu clase gratuita.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="btn btn-cta"
                style={{ width: '100%' }}
              >
                Volver a empezar
              </button>
            </div>
          ) : (
            <>
              <h3 className="hero-form-title">{hero.formTitle}</h3>
              <form onSubmit={handleSubmit} className="hero-form">
                <div className="form-field">
                  <label htmlFor="nombre">Tu Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    required
                    placeholder="Ej. María"
                    value={formData.nombre}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="apellidos">Tus Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    required
                    placeholder="Ej. García López"
                    value={formData.apellidos}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="telefono">Teléfono WhatsApp</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    required
                    placeholder="Ej. 600 123 456"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ubicacion">Sede de Preferencia</label>
                  <select
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                  >
                    {sharedLocations.map((loc, idx) => (
                      <option key={idx} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-cta"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Enviando...' : hero.ctaText}
                </button>

                <p className="form-disclaimer">
                  Tus datos están seguros. Solo los usaremos para gestionar tu clase de prueba.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
