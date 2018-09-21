const path = require('path');
// var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;

if(!process.env.ENV) {
  throw 'ENV not set.'
}
const watch = process.env.WATCH !== 'false';

module.exports = {
  entry: "./source/js/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/js"
  },
  watch,

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    modules: [
      path.resolve('../shared'),
      path.resolve('source/js'),
      'node_modules'
    ],
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx",  ".js", ".json"],
    alias: {
      "@shared": path.resolve(__dirname, "../shared/@shared/"),
      "@env": path.resolve(__dirname, "../shared/@env/"),
    },
    // plugins: [
    //     new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
    // ]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'string-replace-loader',
        options: {
          search: '@{ENV}',
          replace: process.env.ENV.toLowerCase(),
        }
      },

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "lodash": "_",
    "jquery": "$"
  },
};