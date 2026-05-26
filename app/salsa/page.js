import React from 'react';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Method from '../../components/Method';
import SocialProof from '../../components/SocialProof';
import Locations from '../../components/Locations';
import Faq from '../../components/Faq';
import FooterCTA from '../../components/FooterCTA';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';

import { salsaData } from '../../data/salsa';
import { sharedData } from '../../data/shared';

export const metadata = {
  title: salsaData.meta.title,
  description: salsaData.meta.description,
  openGraph: {
    title: salsaData.meta.title,
    description: salsaData.meta.description,
    type: 'website',
  },
};

export default function SalsaPage() {
  return (
    <>
      {/* 1. Cabecera Minimalista (Sin Menú) */}
      <Header whatsapp={salsaData.whatsapp} />

      <main>
        {/* 2. Sección Hero (Above the fold) */}
        <Hero 
          hero={salsaData.hero} 
          discipline={salsaData.discipline} 
          sharedLocations={sharedData.locations} 
        />

        {/* 3. El Método Palladium: ¿Por qué nosotros? */}
        <Method method={salsaData.method} />

        {/* 4. Prueba Social y Números (Validación) */}
        <SocialProof socialProof={salsaData.socialProof} />

        {/* 5. Dónde estamos y Horarios (Proximidad Local) */}
        <Locations locations={sharedData.locations} />

        {/* 6. Sección de Preguntas Frecuentes (FAQ) */}
        <Faq faq={salsaData.faq} />

        {/* 7. Cierre con Urgencia (CTA Final) */}
        <FooterCTA 
          footerCta={salsaData.footerCta} 
          whatsapp={salsaData.whatsapp} 
          sharedLocations={sharedData.locations}
          discipline={salsaData.discipline}
        />
      </main>

      {/* Botón flotante de conversión instantánea WhatsApp */}
      <FloatingWhatsApp whatsapp={salsaData.whatsapp} />
    </>
  );
}

