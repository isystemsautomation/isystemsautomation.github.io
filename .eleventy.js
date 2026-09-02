module.exports = function (eleventyConfig) {
  const enhanceHtml = require('./src/_transforms/enhance-html.js');
  const fs = require('fs');
  const path = require('path');
  const crypto = require('crypto');

  const cssPath = path.join(__dirname, 'src/assets/css/isa.css');
  const cssHash = crypto
    .createHash('md5')
    .update(fs.readFileSync(cssPath))
    .digest('hex')
    .slice(0, 8);
  eleventyConfig.addGlobalData('cssVersion', cssHash);

  function normalizeNavPath(url) {
    if (!url) return '';
    let u = String(url).trim();
    if (u === '/index.html' || u === '/index' || u === '/') return '/';
    u = u.replace(/\/index\.html$/, '/');
    if (u.endsWith('.html')) return u;
    if (!u.endsWith('/')) u += '/';
    return u;
  }

  eleventyConfig.addFilter('navCurrent', (item, currentUrl) => {
    const cur = normalizeNavPath(currentUrl);
    if (cur === '/') return false;
    const itemUrl = normalizeNavPath(item.url);
    if (itemUrl && itemUrl !== '/' && cur === itemUrl) return true;
    if (item.children) {
      for (const child of item.children) {
        if (normalizeNavPath(child.url) === cur) return true;
      }
    }
    return false;
  });

  eleventyConfig.addFilter('navUrlMatch', (a, b) => normalizeNavPath(a) === normalizeNavPath(b));

  eleventyConfig.addTransform('enhance-html', enhanceHtml);
  eleventyConfig.addPassthroughCopy({
    "static/CNAME": "CNAME",
    "static/robots.txt": "robots.txt",
    "static/.nojekyll": ".nojekyll",
    "static/favicon.ico": "favicon.ico",
    "static/apple-touch-icon.png": "apple-touch-icon.png",
    "static/site.webmanifest": "site.webmanifest",
    "static/icons": "icons",
    "src/examen/": "examen/",
  });
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addCollection("pages", (collectionApi) =>
    collectionApi
      .getAll()
      .filter(
        (item) =>
          item.inputPath.includes(`${require("path").sep}src${require("path").sep}`) &&
          item.inputPath.endsWith(".njk") &&
          !item.inputPath.endsWith("sitemap.njk") &&
          !item.filePathStem.endsWith("smoke-test") &&
          !item.data.eleventyExcludeFromCollections,
      ),
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
