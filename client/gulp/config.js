const path = require('path');
const fs = require('fs');
let bundles = (srcPath) => fs.readdirSync(path.resolve(__dirname, srcPath)).filter(name => name.indexOf('.bundle') > -1).map(name => name.replace(/\.bundle.*$/g, ''));

module.exports = function(ENV) {
  const envConfigPath = `../../shared/@env/${ENV.toLowerCase()}-client`;
  const EnvConfig = require(envConfigPath).default;

  return {
    NODE_MODULES: [ 
        'lodash',
        'jquery',
        'lockr'
    ],
    GA: EnvConfig.GA,
    SENTRY: EnvConfig.SENTRY,
    ENV: ENV,
    VERSION: EnvConfig.CLIENT_VERSION,
    CSS_BUNDLES: bundles('../source/css'),
    JS_BUNDLES: ['global', 'main'],
    EXT: {
      JS: 'ts'
    }
  };
};