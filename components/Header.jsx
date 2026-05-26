'use client';

import React, { useState, useEffect } from 'react';

export default function Header({ whatsapp }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(whatsapp.message)}`;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#" style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/logo-palladium.png" 
            alt="Academia Palladium Salsa" 
            style={{ 
              height: '38px', 
              width: 'auto', 
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp header-whatsapp"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.66.986 3.284 1.48 4.961 1.482 5.35 0 9.703-4.305 9.706-9.598.002-2.564-1.002-4.974-2.83-6.8a9.58 9.58 0 00-6.877-2.822c-5.36 0-9.713 4.31-9.716 9.604-.002 1.77.472 3.497 1.374 5.065l-.997 3.64 3.735-.976-.356-.195zM15.84 12.75c-.34-.17-2.01-1-2.322-1.115-.313-.114-.54-.17-.768.17-.227.34-.879 1.114-1.078 1.342-.199.227-.398.256-.738.085a11.107 11.107 0 01-4.094-2.522 12.28 12.28 0 01-2.828-3.52c-.2-.34-.02-.524.15-.694.153-.153.34-.398.51-.597.17-.198.227-.34.34-.568.113-.227.056-.426-.028-.596-.085-.17-.768-1.848-1.05-2.53-.277-.665-.558-.574-.768-.584-.199-.01-.426-.01-.653-.01-.227 0-.597.085-.91.426-.312.34-1.193 1.165-1.193 2.84 0 1.677 1.222 3.297 1.393 3.524.17.227 2.402 3.668 5.82 5.145 2.843 1.228 3.418 1.282 4.094 1.17.682-.114 2.011-.823 2.296-1.59.285-.768.285-1.42.2-1.56-.085-.14-.312-.227-.653-.398z" />
          </svg>
          ¿Tienes dudas? Escríbenos
        </a>
      </div>
    </header>
  );
}
