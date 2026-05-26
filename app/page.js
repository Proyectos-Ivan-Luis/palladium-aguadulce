'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('/salsa');
  }, []);

  return (
    <div style={{ background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-body)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '1rem' }}>Redireccionando a la página de Salsa...</p>
      </div>
    </div>
  );
}
