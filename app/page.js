import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Method from '../components/Method';
import SocialProof from '../components/SocialProof';
import Locations from '../components/Locations';
import Faq from '../components/Faq';
import FooterCTA from '../components/FooterCTA';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

import { academyData } from '../data/academy';
import { sharedData } from '../data/shared';

export const metadata = {
  title: academyData.meta.title,
  description: academyData.meta.description,
  openGraph: {
    title: academyData.meta.title,
    description: academyData.meta.description,
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      {/* 1. Cabecera Minimalista (Sin Menú) */}
      <Header whatsapp={academyData.whatsapp} />

      <main>
        {/* 2. Sección Hero (Above the fold) */}
        <Hero
          hero={heroDataWithFallback(academyData.hero)}
          discipline={academyData.discipline}
          sharedLocations={sharedData.locations}
        />

        {/* 4. Prueba Social y Números (Validación) */}
        <SocialProof socialProof={academyData.socialProof} />

        {/* 3. El Método Palladium: ¿Por qué nosotros? */}
        <Method method={academyData.method} />

        {/* 5. Dónde estamos y Horarios (Proximidad Local) */}
        <Locations locations={sharedData.locations} />

        {/* 6. Sección de Preguntas Frecuentes (FAQ) */}
        <Faq faq={academyData.faq} />

        {/* 7. Cierre con Urgencia (CTA Final) */}
        <FooterCTA
          footerCta={academyData.footerCta}
          whatsapp={academyData.whatsapp}
          sharedLocations={sharedData.locations}
          discipline={academyData.discipline}
        />
      </main>

      {/* Botón flotante de conversión instantánea WhatsApp */}
      <FloatingWhatsApp whatsapp={academyData.whatsapp} />
    </>
  );
}

// Función auxiliar simple para garantizar que no haya crash de datos
function heroDataWithFallback(hero) {
  return {
    heading: hero?.heading || "Aprende a bailar",
    headingAccent: hero?.headingAccent || "Salsa y Bachata",
    headingSuffix: hero?.headingSuffix || "con el Método Palladium.",
    subheading: hero?.subheading || "Clases dinámicas sin experiencia ni pareja previa.",
    formTitle: hero?.formTitle || "Reserva tu plaza gratis",
    ctaText: hero?.ctaText || "Reservar ahora",
    backgroundImage: hero?.backgroundImage || null,
  };
}
