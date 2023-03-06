module.exports = ({ mode }) => {
  const CSSNANO_CONFIG =
    mode === 'production'
      ? require('cssnano')({ preset: 'advanced' })
      : require('cssnano')({
          preset: [
            'advanced',
            {
              normalizeWhitespace: false,
              discardComments: false,
              reduceIdents: false,
              zindex: false
            }
          ]
        });
  const PURGE_CSS_CONFIG = require('@fullhuman/postcss-purgecss')({
    content: [`./index.html`, `./src/**/*.vue`],
    defaultExtractor(content) {
      const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
      return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
    },
    safelist: [
      /-(leave|enter|appear)(|-(to|from|active))$/,
      /^(?!(|.*?:)cursor-move).+-move$/,
      /^router-link(|-exact)-active$/,
      /data-v-.*/
    ]
  });

  return {
    plugins: [CSSNANO_CONFIG, PURGE_CSS_CONFIG, require('autoprefixer')]
  };
};
