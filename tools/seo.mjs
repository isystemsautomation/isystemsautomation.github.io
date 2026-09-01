/** Shared SEO defaults for page generation. */
export const SITE_ORIGIN = 'https://www.isystemsautomation.com';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/img/og-default.jpg`;

/** Slug or permalink stem → absolute og:image URL (1200×630 crops). */
export const PAGE_OG_IMAGES = {
  'combined-cycle-power-plants': `${SITE_ORIGIN}/assets/img/og/combined-cycle.jpg`,
  references: `${SITE_ORIGIN}/assets/img/og/references.jpg`,
  compliance: `${SITE_ORIGIN}/assets/img/og/compliance.jpg`,
  'plant-performance': `${SITE_ORIGIN}/assets/img/og/plant-performance.jpg`,
  'island-mode': `${SITE_ORIGIN}/assets/img/og/island-mode.jpg`,
};

export function canonicalUrl(slug, permalink) {
  if (slug === 'index') return `${SITE_ORIGIN}/`;
  if (slug === 'homemaster') return `${SITE_ORIGIN}/homemaster/`;
  if (permalink === '/island-mode/') return `${SITE_ORIGIN}/island-mode/`;
  if (permalink === '/projects/index.html') return `${SITE_ORIGIN}/projects/`;
  return `${SITE_ORIGIN}${permalink}`;
}

export function ogImageForSlug(slug) {
  return PAGE_OG_IMAGES[slug] ?? DEFAULT_OG_IMAGE;
}

export function serviceJsonLd(serviceType, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'Organization',
      name: 'ISYSTEMS AUTOMATION S.R.L.',
      url: SITE_ORIGIN,
    },
    areaServed: 'Europe',
    description,
  };
}
