import React from 'react';

export default function Locations({ locations }) {
  // SVG de mapa urbano minimalista premium (se ve increíble en blanco y negro)
  const renderMapMockup = (cityName) => {
    return (
      <svg 
        viewBox="0 0 400 200" 
        style={{ width: '100%', height: '100%', display: 'block', background: '#EAEAEA' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D5D5D5" strokeWidth="1.5" />
          </pattern>
        </defs>
        
        {/* Fondo del mapa */}
        <rect width="100%" height="100%" fill="#F3F3F3" />
        
        {/* Calles simuladas */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Carreteras diagonales */}
        <line x1="-50" y1="50" x2="450" y2="150" stroke="#E5E5E5" strokeWidth="12" />
        <line x1="100" y1="-50" x2="300" y2="250" stroke="#E5E5E5" strokeWidth="16" />
        
        {/* Parques / Zonas verdes en escala de grises */}
        <rect x="50" y="80" width="80" height="60" fill="#EAEAEA" rx="8" />
        <rect x="260" y="20" width="100" height="70" fill="#EAEAEA" rx="8" />

        {/* Ríos / Canales en gris oscuro */}
        <path d="M-10,180 Q100,160 200,190 T410,170" fill="none" stroke="#DCDCDC" strokeWidth="24" strokeLinecap="round" />

        {/* Pin del mapa en color acento de conversión */}
        <g transform="translate(200, 100)">
          {/* Sombra del pin */}
          <ellipse cx="0" cy="18" rx="8" ry="3" fill="rgba(0,0,0,0.15)" />
          
          {/* El Pin en naranja fuego */}
          <path 
            d="M0,0 C-10,-10 -15,-20 -15,-30 C-15,-41 -6,-50 5,-50 C16,-50 25,-41 25,-30 C25,-20 20,-10 10,0 L0,18 Z" 
            fill="var(--accent-cta)" 
          />
          <circle cx="5" cy="-30" r="8" fill="#FFFFFF" />
          
          {/* Etiqueta de la Sede */}
          <rect x="-60" y="-85" width="130" height="26" fill="var(--black)" rx="4" />
          <text x="5" y="-68" fill="#FFFFFF" fontFamily="var(--font-body)" fontSize="10" fontWeight="bold" textAnchor="middle">
            PALLADIUM {cityName.toUpperCase()}
          </text>
          {/* Triangulito de la etiqueta */}
          <polygon points="0,-59 -6,-59 6,-59" fill="var(--black)" />
        </g>
      </svg>
    );
  };

  return (
    <section className="section" id="donde-estamos">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="text-caption" style={{ color: 'var(--black)' }}>
            Proximidad local
          </span>
          <h2 className="heading-section">¿Dónde Estamos?</h2>
          <p className="section-subtitle">
            Elige la sede que te pille más a mano. Instalaciones amplias, climatizadas y de fácil aparcamiento.
          </p>
        </div>

        <div className="locations-grid">
          {locations.map((loc, idx) => (
            <div key={idx} className="location-card">
              {/* Mapa estático premium que enlaza externamente a Google Maps */}
              <a 
                href={loc.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="location-map-link"
                title={`Abrir ubicación de Sede ${loc.name} en Google Maps`}
              >
                {renderMapMockup(loc.name)}
                <div className="location-map-badge">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Cómo llegar
                </div>
              </a>

              <div className="location-info">
                <h3>Sede {loc.name}</h3>
                
                <div className="location-detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <strong>{loc.address}</strong>
                    {loc.subtitle && <div style={{ fontSize: '0.85rem', color: 'var(--gray-400)' }}>{loc.subtitle}</div>}
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{loc.city}</div>
                  </div>
                </div>

                <div className="location-detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong>Horario clases:</strong>
                    <div>{loc.schedule}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
