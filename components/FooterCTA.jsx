'use client';

import React, { useState } from 'react';

export default function FooterCTA({ footerCta, whatsapp, sharedLocations, discipline }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    ubicacion: sharedLocations?.[0]?.name || 'Roquetas de Mar'
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

      // Disparar evento de conversión
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

  const whatsappUrl = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;

  return (
    <>
      <section className="footer-cta" style={{ backgroundColor: '#000000', color: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '480px' }}>
          <h2 style={{ color: '#FFFFFF', marginBottom: '0.75rem' }}>{footerCta.title}</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            {footerCta.subtitle}
          </p>

          {/* Formulario Vertical de Conversión Final */}
          <div
            className="hero-form-wrapper"
            style={{
              backgroundColor: '#111111',
              border: '1px solid #333',
              color: '#FFFFFF',
              textAlign: 'left',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>
                  ¡Plaza Reservada!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Hemos recibido tus datos correctamente. Un asesor de Palladium se pondrá en contacto contigo en las próximas 24 horas.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn btn-cta"
                  style={{ width: '100%', backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #FFFFFF' }}
                >
                  Volver a empezar
                </button>
              </div>
            ) : (
              <>
                <h3 className="hero-form-title" style={{ color: '#FFFFFF', fontSize: '1.15rem', marginBottom: '1.25rem' }}>
                  Prueba una clase gratis
                </h3>

                <form onSubmit={handleSubmit} className="hero-form">
                  <div className="form-field">
                    <label htmlFor="footer-nombre" style={{ color: 'rgba(255,255,255,0.5)' }}>Tu Nombre</label>
                    <input
                      type="text"
                      id="footer-nombre"
                      name="nombre"
                      required
                      placeholder="Ej. María"
                      value={formData.nombre}
                      onChange={handleChange}
                      style={{
                        backgroundColor: '#222222',
                        border: '1.5px solid #444',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="footer-apellidos" style={{ color: 'rgba(255,255,255,0.5)' }}>Tus Apellidos</label>
                    <input
                      type="text"
                      id="footer-apellidos"
                      name="apellidos"
                      required
                      placeholder="Ej. García López"
                      value={formData.apellidos}
                      onChange={handleChange}
                      style={{
                        backgroundColor: '#222222',
                        border: '1.5px solid #444',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="footer-telefono" style={{ color: 'rgba(255,255,255,0.5)' }}>Teléfono WhatsApp</label>
                    <input
                      type="tel"
                      id="footer-telefono"
                      name="telefono"
                      required
                      placeholder="Ej. 600 123 456"
                      value={formData.telefono}
                      onChange={handleChange}
                      style={{
                        backgroundColor: '#222222',
                        border: '1.5px solid #444',
                        color: '#FFFFFF'
                      }}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="footer-ubicacion" style={{ color: 'rgba(255,255,255,0.5)' }}>Sede de Preferencia</label>
                    <select
                      id="footer-ubicacion"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                      style={{
                        backgroundColor: '#222222',
                        border: '1.5px solid #444',
                        color: '#FFFFFF',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23FFFFFF' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`
                      }}
                    >
                      {sharedLocations?.map((loc, idx) => (
                        <option key={idx} value={loc.name} style={{ backgroundColor: '#222222', color: '#FFFFFF' }}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-cta"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      marginTop: '0.25rem',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      border: '1px solid #FFFFFF'
                    }}
                  >
                    {status === 'loading' ? 'Enviando...' : `Reservar plaza gratis de ${discipline}`}
                  </button>

                  <p className="form-disclaimer" style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
                    Tus datos están seguros. Solo los usaremos para gestionar tu clase de prueba.
                  </p>
                </form>
              </>
            )}
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>¿Tienes alguna pregunta directa?</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="footer-bottom" style={{ backgroundColor: '#050505', color: '#666666', borderTop: '1px solid #111' }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Academia de Baile Palladium. Todos los derechos reservados.</p>
          <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#444444' }}>
            Diseñado especialmente para dispositivos móviles · Campaña de Conversión Google Ads
          </p>
        </div>
      </footer>
    </>
  );
}
