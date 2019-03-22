const node_env = process.env.DEVELOPMENT === 'true' ? 'development' : 'production';
process.env.BABEL_ENV = node_env;
process.env.NODE_ENV = node_env;

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config.services');

const hasService = fs.existsSync(paths.serviceJs);

console.log(paths.serviceJs);

const build = config => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true }),
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
};

if (hasService) {
  const config = configFactory(node_env, [paths.serviceJs]);
  if (process.env.ANALYSIS === 'true') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8889,
        generateStatsFile: true,
      }),
    );
  }
  build(config)
    .then(
      ({ stats, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'));
          console.log(warnings.join('\n\n'));
          console.log(
            `\nSearch for the ${chalk.underline(
              chalk.yellow('keywords'),
            )} to learn more about each warning.`,
          );
          console.log(
            `To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`,
          );
        } else {
          console.log(chalk.green('Compiled successfully.\n'));
        }
      },
      err => {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      },
    )
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });
}
