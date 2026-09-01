module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "static/CNAME": "CNAME",
    "static/robots.txt": "robots.txt",
    "static/.nojekyll": ".nojekyll",
  });
  eleventyConfig.addPassthroughCopy("src/assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
