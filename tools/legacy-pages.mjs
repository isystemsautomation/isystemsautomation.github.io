/** 23 legacy HTML pages — paths from REBUILD.md section 2 */
export const LEGACY_PAGES = [
  'index.html',
  '404.html',
  'advanced-controllers-cfb-boiler.html',
  'company.html',
  'contact.html',
  'cookies.html',
  'industries.html',
  'power-plant-performance-calculation.html',
  'privacy.html',
  'references.html',
  'service.html',
  'virtual-power-plant.html',
  'service/industrial-furniture-control-centers.html',
  'service/maintenance.html',
  'service/manufacturing-execution-system.html',
  'service/process-automation.html',
  'service/process-optimization-advanced-process-control.html',
  'service/safety-systems-burner-management-systems.html',
  'industries/bulk-material-handling.html',
  'industries/control-centers.html',
  'industries/oil-and-gas.html',
  'industries/power-generation.html',
  'homemaster.html',
];

export function legacyPathToUrl(relativePath) {
  return `/${relativePath}`;
}

export function legacyPathToSlug(relativePath) {
  return relativePath.replace(/\.html$/i, '').replace(/\//g, '-');
}
