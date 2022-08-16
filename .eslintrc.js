'use strict';
const { backend } = require('@luckbox/eslint-rules');

module.exports = {
  ...backend,
  ignorePatterns: [
    'docs/*',
  ],
  plugins: backend.plugins.concat('security'),
  extends: backend.extends.concat('plugin:security/recommended'),
};
