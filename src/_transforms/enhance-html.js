const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ICONS = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../_data/icons.json'), 'utf8'),
);

const TABLER = {
  'settings-automation':
    '<path d="M12 10a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/><path d="M12 3c.132 0 .263 0 .393 0a1.5 1.5 0 0 0 1.48 -1.153a6 6 0 0 1 3.127 3.127a1.5 1.5 0 0 0 1.153 1.48c0 .132 0 .263 0 .393a1.5 1.5 0 0 0 1.153 1.48a6 6 0 0 1 3.127 3.127a1.5 1.5 0 0 0 1.48 1.153c0 .132 0 .263 0 .393a1.5 1.5 0 0 0 1.48 1.153a6 6 0 0 1 -3.127 3.127a1.5 1.5 0 0 0 -1.153 1.48c0 .132 0 .263 0 .393a1.5 1.5 0 0 0 -1.48 1.153a6 6 0 0 1 -3.127 3.127a1.5 1.5 0 0 0 -1.153 1.48c0 .132 0 .263 0 .393a1.5 1.5 0 0 0 -1.153 1.48a6 6 0 0 1 -3.127 -3.127a1.5 1.5 0 0 0 -1.48 -1.153c0 -.132 0 -.263 0 -.393a1.5 1.5 0 0 0 -1.153 -1.48a6 6 0 0 1 -3.127 -3.127a1.5 1.5 0 0 0 -1.48 -1.153c0 -.132 0 -.263 0 -.393a1.5 1.5 0 0 0 -1.153 -1.48a6 6 0 0 1 -3.127 -3.127a1.5 1.5 0 0 0 -1.153 -1.48a1.5 1.5 0 0 0 -.393 0"/>',
  'chart-arrows-vertical':
    '<path d="M18 20v-8"/><path d="M12 20v-4"/><path d="M6 20v-12"/><path d="M20 16l-2 2l-2 -2"/><path d="M14 12l-2 2l-2 -2"/><path d="M8 8l-2 2l-2 -2"/>',
  database:
    '<path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"/><path d="M4 6v6a8 3 0 0 0 16 0v-6"/><path d="M4 12v6a8 3 0 0 0 16 0v-6"/>',
  'shield-check':
    '<path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/>',
  'device-desktop-analytics':
    '<path d="M3 4a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-12z"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/><path d="M9 12v-4"/><path d="M12 12v-1"/><path d="M15 12v-2"/><path d="M12 12v-1"/>',
  tool: '<path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"/>',
  bolt: '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/>',
  flame:
    '<path d="M12 10.941c2.333 -3.308 .167 -7.117 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.621 -2.333 5.588c0 3.704 3.134 6.706 7 6.706s7 -3.002 7 -6.706c0 -1.867 -.9 -4.18 -2.333 -5.588c-1.095 1.08 -2.267 2.447 -2.667 2.941c-.4 -.494 -.667 -.941 -.667 -1.529a1.53 1.53 0 0 1 1.5 -1.5c.25 0 .5 .063 .667 .176"/>',
  'truck-loading':
    '<path d="M2 3h1a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h15"/><path d="M9 6h10l4 4v5a2 2 0 0 1 -2 2h-1"/><path d="M13 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M18 15m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M19 9h-4v4"/><path d="M7 15l0 -5l-5 -5"/>',
  'layout-dashboard':
    '<path d="M4 4h6v8h-6z"/><path d="M14 4h6v4h-6z"/><path d="M14 12h6v8h-6z"/><path d="M4 16h6v4h-6z"/>',
  'chevron-right': '<path d="M9 6l6 6l-6 6"/>',
  'chevron-down': '<path d="M6 9l6 6l6 -6"/>',
};

const SERVICE_ICON_DIR = path.join(__dirname, '../assets/img/icons');
const serviceIconCache = {};

function serviceIconInner(name) {
  if (Object.prototype.hasOwnProperty.call(serviceIconCache, name)) {
    return serviceIconCache[name];
  }
  const filePath = path.join(SERVICE_ICON_DIR, `${name}.svg`);
  if (!fs.existsSync(filePath)) {
    serviceIconCache[name] = null;
    return null;
  }
  const svg = fs.readFileSync(filePath, 'utf8');
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();
  serviceIconCache[name] = inner;
  return inner;
}

const HOME_STATS = [
  ['Since 2007', 'Company founded in Ploiești, Romania'],
  ['ISO 9001', 'Certified since 2009'],
  ['260 t/h at 100 bar', 'Largest CFB boiler under our control system'],
  [
    '6 DCS platforms',
    'Ovation, ABB 800xA, ABB Symphony, PCS7, TIA Portal, Centum VP',
  ],
];

const PAGE_HERO_IMAGES = {
  'industries.html': '/assets/img/projects/control-room-power-plant-operators.jpg',
  'service.html': '/assets/img/projects/marshalling-cable-marking.jpg',
  'references.html': '/assets/img/projects/control-room-combined-cycle-wide.jpg',
  'company.html': '/assets/img/projects/central-control-room-in-use.jpg',
  'homemaster/index.html': '/assets/img/homemaster/control-panel-wired-hero.jpg',
};

const INDUSTRY_MEDIA = {
  '/industries/power-generation.html': {
    src: '/assets/img/projects/steam-turbine-casing.jpg',
    alt: 'Steam turbine casing with control valve actuator',
    width: 960,
    height: 640,
  },
  '/industries/oil-and-gas.html': {
    src: '/assets/img/projects/atex-zone2-barriers.jpg',
    alt: 'ATEX Zone 2 intrinsically safe isolating barriers in a control cabinet',
    width: 960,
    height: 640,
  },
  '/industries/control-centers.html': {
    src: '/assets/img/projects/central-control-room-consoles.jpg',
    alt: 'Central control room with operator consoles and overview displays',
    width: 1216,
    height: 811,
  },
  '/industries/bulk-material-handling.html': {
    src: '/assets/img/2024/08/10/cement_and_coal.jpg',
    alt: 'Bulk material handling and weigh batching plant',
    width: 635,
    height: 505,
  },
};

const HOME_SPLIT_PHOTOS = [
  {
    src: '/assets/img/projects/substation-220kv-scada-redacted.jpg',
    alt: '',
    width: 960,
    height: 640,
    caption: '',
  },
  {
    src: '/assets/img/projects/ovation-turbine-trend-redacted.jpg',
    alt: 'Ovation DCS turbine trend display during island mode testing',
    width: 960,
    height: 640,
    caption: 'Ovation DCS turbine trend display during island mode testing',
  },
];

const BREADCRUMB_LABELS = {
  industries: 'Industries',
  service: 'Services',
  projects: 'Projects',
  homemaster: 'HomeMaster',
  company: 'Company',
  contact: 'Contact',
  references: 'References',
  compliance: 'Compliance',
  cybersecurity: 'Cyber Security',
  cookies: 'Cookies',
  privacy: 'Privacy Policy',
  '404': '404',
  'power-generation': 'Power Generation',
  'oil-and-gas': 'Oil and Gas',
  'bulk-material-handling': 'Bulk material handling',
  'control-centers': 'Control Centers',
  'process-automation': 'Process Automation',
  'process-optimization-advanced-process-control': 'Process optimisation',
  'manufacturing-execution-system': 'MES and production data systems',
  'safety-systems-burner-management-systems': 'Safety Systems and BMS',
  'industrial-furniture-control-centers': 'Industrial furniture',
  maintenance: 'Maintenance',
  'advanced-controllers-cfb-boiler': 'Advanced Controllers for CFB Boilers',
  'power-plant-performance-calculation': 'Power Plant Performance Calculation',
  'virtual-power-plant': 'Virtual Power Plant',
  'island-mode': 'Island Mode Operation',
  'plant-performance': 'Plant Performance',
  'combined-cycle-power-plants': 'Combined Cycle Power Plants',
  'acceptance-testing': 'Acceptance Testing',
};

function iconSvg(name, size = 32) {
  let paths = TABLER[name];
  let strokeWidth = '1.5';
  if (!paths) {
    paths = serviceIconInner(name);
    strokeWidth = '1.75';
  }
  if (!paths) return '';
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function chevronSvg() {
  return iconSvg('chevron-right', 16);
}

function cardChevronCorner() {
  return `<span class="card__chevron" aria-hidden="true">${chevronSvg()}</span>`;
}

function iconHtmlForHref(href) {
  const icon = ICONS[href];
  if (!icon) return '';
  if (icon.startsWith('/')) {
    return `<span class="card__icon"><img class="card__icon-img" src="${icon}" alt="" width="22" height="22" decoding="async"></span>`;
  }
  return `<span class="card__icon">${iconSvg(icon)}</span>`;
}

function industryMediaHtml(href) {
  const data = INDUSTRY_MEDIA[href];
  if (!data) return '';
  return `<figure class="card__media"><img src="${data.src}" alt="${data.alt}" width="${data.width}" height="${data.height}" loading="lazy" decoding="async"></figure>`;
}

function isIndustriesGrid($ul) {
  const title = $ul.closest('section').find('> .container h2.section-title, .container.prose h2.section-title').first().text();
  return title.trim() === 'Industries';
}

function enhanceLinkIndex($, ul) {
  const $ul = $(ul);
  if ($ul.hasClass('card-grid')) return;
  const industries = isIndustriesGrid($ul);
  $ul.addClass('card-grid');
  if (industries) $ul.addClass('card-grid--4');

  $ul.find('> li').each((_, li) => {
    const $li = $(li);
    const $a = $li.find('> a').first();
    const $line = $li.find('> .link-index__line').first();
    if (!$a.length) return;
    const href = $a.attr('href') || '';
    const title = $a.text().trim();
    const text = $line.text().trim();

    if (industries) {
      const media = industryMediaHtml(href);
      const card = `<a class="card card--media" href="${href}">${cardChevronCorner()}${media}<div class="card__body"><span class="card__title">${title}</span><span class="card__text">${text}</span></div></a>`;
      $li.empty().append(card);
      return;
    }

    const iconBlock = iconHtmlForHref(href);
    const card = `<a class="card" href="${href}">${cardChevronCorner()}${iconBlock}<span class="card__title">${title}</span><span class="card__text">${text}</span></a>`;
    $li.empty().append(card);
  });
}

function statBandHtml() {
  const cells = HOME_STATS.map(
    ([value, label]) =>
      `<div class="stat-band__cell"><div class="stat-band__value">${value}</div><div class="stat-band__label">${label}</div></div>`,
  ).join('');
  return `<div class="stat-band"><div class="container"><div class="stat-band__grid">${cells}</div></div></div>`;
}

function breadcrumbsFromPath(outputPath) {
  const normalized = outputPath.replace(/\\/g, '/');
  if (normalized.endsWith('_site/index.html')) return '';

  let rel = normalized.replace(/^.*_site\//, '').replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (!rel || rel === 'index') return '';

  const parts = rel.split('/').filter(Boolean);
  const crumbs = [{ href: '/index.html', label: 'Home' }];
  let hrefAcc = '';

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (!part.endsWith('.html') && i === parts.length - 1) {
      hrefAcc = `/${parts.join('/')}/`;
    } else if (part.endsWith('.html') || i === parts.length - 1) {
      hrefAcc = `/${parts.slice(0, i + 1).join('/')}`.replace(/\/index$/, '/');
      if (!hrefAcc.endsWith('.html') && !hrefAcc.endsWith('/')) {
        hrefAcc += '.html';
      }
    } else {
      hrefAcc = `/${parts.slice(0, i + 1).join('/')}/`;
    }
    const slug = part.replace(/\.html$/, '');
    crumbs.push({
      href: hrefAcc.startsWith('/') ? hrefAcc : `/${hrefAcc}`,
      label:
        BREADCRUMB_LABELS[slug] ||
        slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    });
  }

  if (crumbs.length <= 1) return '';

  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${crumbs
    .map((c, i) => {
      if (i === crumbs.length - 1) {
        return `<span aria-current="page">${c.label}</span>`;
      }
      return `<a href="${c.href}">${c.label}</a>`;
    })
    .join(`<span class="breadcrumbs__sep" aria-hidden="true">${chevronSvg()}</span>`)}</nav>`;
}

function enhanceProjectCards($, section) {
  const $section = $(section);
  const $title = $section.find('h2.section-title').filter((_, el) =>
    $(el).text().includes('Selected projects'),
  );
  if (!$title.length) return;

  const $prose = $title.closest('.prose');
  const children = $prose.children().toArray();
  const cards = [];

  for (let i = 0; i < children.length; i += 1) {
    const $el = $(children[i]);
    if (!$el.is('h3')) continue;
    const $layout = $(children[i + 1]);
    if (!$layout.hasClass('section-promo__layout--card')) continue;

    const href = $el.find('a').attr('href') || '#';
    const title = $el.text().trim();
    const $img = $layout.find('figure img').first();
    const src = $img.attr('src') || '';
    const alt = $img.attr('alt') || '';
    const caption = $layout.find('figcaption').text().trim();
    const text = $layout.find('.section-promo__text p').first().text().trim();
    const captionHtml = caption
      ? `<span class="card__caption">${caption}</span>`
      : '';

    cards.push(
      `<a class="card card--media" href="${href}">${cardChevronCorner()}<figure class="card__media"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></figure><div class="card__body"><span class="card__title">${title}</span>${captionHtml}<span class="card__text">${text}</span><span class="card__link">Read more ${chevronSvg()}</span></div></a>`,
    );
    $el.remove();
    $layout.remove();
  }

  if (cards.length) {
    $title.after(`<div class="card-grid card-grid--projects">${cards.join('')}</div>`);
  }
}

function enhanceButtons($) {
  $('.btn--primary, .btn--secondary').each((_, btn) => {
    const $btn = $(btn);
    if ($btn.find('.icon').length) return;
    $btn.append(chevronSvg());
  });
}

function enhanceDl($) {
  $('dl').each((_, dl) => {
    const $dl = $(dl);
    if ($dl.find('> div > dt').length) {
      $dl.addClass('fact-list');
    }
  });
}

function homeSplitPhotosAside() {
  const rows = HOME_STATS.map(
    ([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`,
  ).join('');
  const panel = `<div class="panel panel--aside"><dl class="fact-list">${rows}</dl></div>`;
  const figures = HOME_SPLIT_PHOTOS.map((p) => {
    const cap = p.caption ? `<figcaption>${p.caption}</figcaption>` : '';
    return `<figure><img src="${p.src}" alt="${p.alt}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">${cap}</figure>`;
  }).join('');
  return `<aside class="split__aside"><div class="split__aside-stack">${panel}<div class="split__photos">${figures}</div></div></aside>`;
}

function factPanelHtml() {
  const rows = HOME_STATS.map(
    ([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`,
  ).join('');
  return `<aside class="split__aside"><div class="panel"><dl class="fact-list">${rows}</dl></div></aside>`;
}

function wrapSplit($container, asideHtml) {
  if (!$container.length || $container.find('.split').length) return;
  const inner = $container.html();
  $container.removeClass('prose').html(
    `<div class="split"><div class="split__main prose">${inner}</div>${asideHtml}</div>`,
  );
}

function splitFigureAside($, $container) {
  if (!$container.length || $container.find('.split').length) return;
  const $figure = $container.children('figure').first();
  if (!$figure.length) return;
  const figureHtml = $.html($figure);
  $figure.remove();
  const inner = $container.html();
  $container.removeClass('prose').html(
    `<div class="split"><div class="split__main prose">${inner}</div><aside class="split__aside">${figureHtml}</aside></div>`,
  );
}

function enhanceSplitSections($, outputPath) {
  const rel = (outputPath || '').replace(/\\/g, '/').replace(/^.*_site\//, '');

  if (rel === 'index.html') {
    $('section.section h2.section-title').each((_, h2) => {
      if (!$(h2).text().includes('What we do that others do not')) return;
      wrapSplit($(h2).closest('.container.prose'), homeSplitPhotosAside());
    });
    return;
  }

  const factPanelPages = new Set(['industries.html', 'service.html', 'company.html']);
  if (factPanelPages.has(rel)) {
    wrapSplit(
      $('.page-hero').next('section.section').find('> .container.prose').first(),
      factPanelHtml(),
    );
    return;
  }

  if (rel.startsWith('service/') || rel.startsWith('industries/')) {
    splitFigureAside(
      $,
      $('.page-hero').next('section.section').find('> .container.prose').first(),
    );
  }
}

function enhanceHero($, outputPath) {
  const rel = (outputPath || '').replace(/\\/g, '/').replace(/^.*_site\//, '');
  $('.hero').each((_, hero) => {
    const $hero = $(hero);
    const $img = $hero.children('img').first();
    if (rel === 'index.html' && $img.length) {
      $img.attr({
        src: '/assets/img/projects/control-room-power-plant-videowall-hero.jpg',
        alt: 'Power plant control room with overview video wall',
        width: '2400',
        height: '1000',
      });
    }
    const $container = $hero.children('.container').first();
    if (!$container.length) return;
    if ($container.find('.hero__content').length) return;
    const inner = $container.html();
    $container.removeClass('prose').html(`<div class="hero__content prose">${inner}</div>`);
  });
}

function enhancePageHeroImage($, outputPath) {
  const rel = (outputPath || '').replace(/\\/g, '/').replace(/^.*_site\//, '');
  if (rel === 'contact.html') return;

  $('.page-hero').each((_, hero) => {
    const $hero = $(hero);
    if ($hero.children('img.hero-texture').length || $hero.children('img').length) return;

    const mapped = PAGE_HERO_IMAGES[rel];
    let src = mapped;
    if (!src) {
      const $img = $hero.nextAll('section.section').find('figure img').first();
      if ($img.length) src = $img.attr('src');
    }
    if (!src) return;

    $hero.prepend(
      `<img class="hero-texture" src="${src}" alt="" aria-hidden="true" width="2400" height="800" decoding="async">`,
    );
  });
}

function enhanceHomeMasterTeaser($, outputPath) {
  const rel = (outputPath || '').replace(/\\/g, '/').replace(/^.*_site\//, '');
  if (rel !== 'index.html') return;

  $('section.section--tint').each((_, section) => {
    const $section = $(section);
    const $p = $section.find('> .container.prose > p').first();
    if (!$p.length || !$p.text().includes('See the full project list')) return;
    if ($section.find('.split').length) return;

    const $container = $section.find('> .container.prose').first();
    const inner = $container.html();
    const aside =
      '<aside class="split__aside"><figure><img src="/assets/img/homemaster/din-rail-modules-plate.jpg" alt="HomeMaster DIN-rail modules on a mounting plate" width="1600" height="1200" loading="lazy" decoding="async"></figure></aside>';
    $container
      .removeClass('prose')
      .html(`<div class="split"><div class="split__main prose">${inner}</div>${aside}</div>`);
  });
}

function enhanceContact($, outputPath) {
  if (!outputPath || !outputPath.endsWith('contact.html')) return;
  const $container = $('.page-hero')
    .next('.section')
    .find('> .container.prose')
    .first();
  if (!$container.length || $container.hasClass('contact-split')) return;
  const inner = $container.html();
  const mapPath = path.join(__dirname, '../assets/img/map-ploiesti.jpg');
  const mapHtml = fs.existsSync(mapPath)
    ? `<img src="/assets/img/map-ploiesti.jpg" alt="Map of Ploiești office location" loading="lazy" decoding="async">`
    : '<span>Ploiești</span>';
  $container
    .removeClass('prose')
    .addClass('contact-split')
    .html(
      `<div class="split"><div class="split__main prose">${inner}</div><aside class="split__aside"><div class="map-placeholder" role="img" aria-label="Map placeholder, Ploiești">${mapHtml}</div></aside></div>`,
    );
}

module.exports = function enhanceHtml(content, outputPath) {
  if (!outputPath || !outputPath.endsWith('.html')) return content;
  if (outputPath.includes('examen/')) return content;
  if (content.includes('http-equiv="refresh"') && content.includes('name="robots" content="noindex"')) {
    return content;
  }

  const $ = cheerio.load(content, { decodeEntities: false });
  const relPath = outputPath.replace(/\\/g, '/');

  enhanceHero($, relPath);

  $('ul.link-index').each((_, ul) => enhanceLinkIndex($, ul));

  if (relPath.endsWith('_site/index.html')) {
    const $hero = $('.hero').first();
    if ($hero.length && !$hero.next('.stat-band').length) {
      $hero.after(statBandHtml());
    }
  }

  const crumbs = breadcrumbsFromPath(relPath);
  $('.page-hero').each((_, hero) => {
    const $hero = $(hero);
    if (crumbs && !$hero.find('.breadcrumbs').length) {
      $hero.find('.container').prepend(crumbs);
    }
  });

  $('section.section').each((_, section) => enhanceProjectCards($, section));

  enhanceButtons($);
  enhanceDl($);
  enhanceSplitSections($, relPath);
  enhanceHomeMasterTeaser($, relPath);
  enhancePageHeroImage($, relPath);
  enhanceContact($, relPath);

  return $.html();
};
