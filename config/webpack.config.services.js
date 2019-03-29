const webpack = require('webpack');
const resolve = require('resolve');
const TerserPlugin = require('terser-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin-alt');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const paths = require('./paths');

const useTypeScript = true;

module.exports = function (webpackEnv, entry) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && '/';

  const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && '';

  return {
    target: 'node',
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    devtool: isEnvProduction ? false : isEnvDevelopment && 'cheap-module-source-map',
    entry,
    output: {
      path: paths.appBuild,
      pathinfo: isEnvDevelopment,
      publicPath,
      filename: 'service.js',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          parallel: true,
          cache: true,
          sourceMap: false,
        }),
      ],
    },
    resolve: {
      modules: paths.resolvePath,
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(js|mjs|ts)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                eslintPath: require.resolve('eslint'),
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: paths.srcList,
        },
        {
          oneOf: [
            {
              test: /\.(js|ts)$/,
              include: paths.srcList,
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                compact: isEnvProduction,
              },
            },
            {
              test: /\.(js)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: true,
                cacheCompression: isEnvProduction,
                sourceMaps: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(webpackEnv),
      }),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment && new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      useTypeScript
        && new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync('typescript', {
            basedir: paths.appNodeModules,
          }),
          async: false,
          checkSyntacticErrors: true,
          tsconfig: paths.appTsConfig,
          compilerOptions: {
            module: 'esnext',
            moduleResolution: 'node',
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'preserve',
          },
          reportFiles: [
            '**',
            '!**/*.json',
            '!**/__tests__/**',
            '!**/?(*.)(spec|test).*',
            '!**/src/setupProxy.*',
            '!**/src/setupTests.*',
          ],
          watch: paths.srcList,
          silent: true,
          formatter: typescriptFormatter,
        }),
    ].filter(Boolean),
  };
};
