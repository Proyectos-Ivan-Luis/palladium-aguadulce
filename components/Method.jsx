import React from 'react';

export default function Method({ method }) {
  // Función para obtener el icono SVG correspondiente
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'lightning':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'clock':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <section className="section section-white" id="metodo">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="text-caption" style={{ color: 'var(--accent-cta)' }}>
            {method.sectionLabel}
          </span>
          <h2 className="heading-section">{method.title}</h2>
          <p className="section-subtitle">{method.subtitle}</p>
        </div>

        <div className="method-grid">
          {method.items.map((item, idx) => (
            <div key={idx} className="method-card">
              <div className="method-icon">{getIcon(item.icon)}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
