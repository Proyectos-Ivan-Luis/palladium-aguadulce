import React from 'react';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Method from '../../components/Method';
import SocialProof from '../../components/SocialProof';
import Locations from '../../components/Locations';
import Faq from '../../components/Faq';
import FooterCTA from '../../components/FooterCTA';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';

import { bachataData } from '../../data/bachata';
import { sharedData } from '../../data/shared';

export const metadata = {
  title: bachataData.meta.title,
  description: bachataData.meta.description,
  openGraph: {
    title: bachataData.meta.title,
    description: bachataData.meta.description,
    type: 'website',
  },
};

export default function BachataPage() {
  return (
    <>
      {/* 1. Cabecera Minimalista (Sin Menú) */}
      <Header whatsapp={bachataData.whatsapp} />

      <main>
        {/* 2. Sección Hero (Above the fold) */}
        <Hero 
          hero={heroDataWithFallback(bachataData.hero)} 
          discipline={bachataData.discipline} 
          sharedLocations={sharedData.locations} 
        />

        {/* 3. El Método Palladium: ¿Por qué nosotros? */}
        <Method method={bachataData.method} />

        {/* 4. Prueba Social y Números (Validación) */}
        <SocialProof socialProof={bachataData.socialProof} />

        {/* 5. Dónde estamos y Horarios (Proximidad Local) */}
        <Locations locations={sharedData.locations} />

        {/* 6. Sección de Preguntas Frecuentes (FAQ) */}
        <Faq faq={bachataData.faq} />

        {/* 7. Cierre con Urgencia (CTA Final) */}
        <FooterCTA 
          footerCta={bachataData.footerCta} 
          whatsapp={bachataData.whatsapp} 
          sharedLocations={sharedData.locations}
          discipline={bachataData.discipline}
        />
      </main>

      {/* Botón flotante de conversión instantánea WhatsApp */}
      <FloatingWhatsApp whatsapp={bachataData.whatsapp} />
    </>
  );
}

// Función auxiliar simple para garantizar que no haya crash de datos
function heroDataWithFallback(hero) {
  return {
    heading: hero?.heading || "Aprende a Bailar",
    headingAccent: hero?.headingAccent || "Bachata",
    headingSuffix: hero?.headingSuffix || "en Roquetas y El Ejido",
    subheading: hero?.subheading || "Clases dinámicas sin experiencia ni pareja previa.",
    formTitle: hero?.formTitle || "Reserva tu plaza gratis",
    ctaText: hero?.ctaText || "Reservar ahora",
    backgroundImage: hero?.backgroundImage || null,
  };
}

