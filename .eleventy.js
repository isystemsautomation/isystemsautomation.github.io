module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "static/CNAME": "CNAME",
    "static/robots.txt": "robots.txt",
    "static/.nojekyll": ".nojekyll",
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
