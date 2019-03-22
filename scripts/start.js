// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ip = require('ip');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
function slugTypeToPort(slug) {
  // Simple string to unsigned short integer hash function, range [5000, 65000)
  // Some result
  //   tags: 25443, comments: 53094, activities: 7032, login: 30727, dicomviewer: 56115, plyviewer: 57501
  //
  // !!DOES NOT guarantee uniqueness!! There might be conflict, but so far so good

  if (!slug) {
    return 0;
  }
  const charDiff = (a, b) => a.charCodeAt(0) - b.charCodeAt(0);
  return ([...slug].reduce((o, c, i) => o + charDiff(c, 'a') * Math.pow(26, i), 0) % 60000) + 5000;
}
const manifest = JSON.parse(fs.readFileSync(require.resolve('../src/app/manifest.webapp')));
const port = slugTypeToPort(manifest.slug) || 3000;

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || port;
const HOST = process.env.HOST || ip.address();

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST),
      )}`,
    ),
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('http://bit.ly/CRA-advanced-config')}`);
  console.log();
}

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');

checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    const config = configFactory('development');
    if (process.env.ANALYSIS === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerPort: 8889,
          generateStatsFile: true,
        }),
      );
    }
    config.bail = false; // disable bail when watching
    config.output = Object.assign({}, config.output, {
      filename: '[name].[hash].js',
      publicPath: `http://${HOST}:${port}/`,
    });
    const json = {
      host: HOST,
      port,
    };
    try {
      fs.mkdirSync(path.join(__dirname, '../tmp'), {
        recursive: true,
      });
    } catch (e) {}
    fs.writeFileSync(
      path.join(__dirname, '../tmp/devserver.js'),
      `module.exports = ${JSON.stringify(json)}`,
    );
    if (Array.isArray(config.entry.app)) {
      config.entry.app = [require.resolve('../config/reference/webpackHotDevClient')].concat(
        config.entry.app,
      );
    }
    if (Array.isArray(config.entry.intents)) {
      config.entry.intents = [require.resolve('../config/reference/webpackHotDevClient')].concat(
        config.entry.intents,
      );
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
