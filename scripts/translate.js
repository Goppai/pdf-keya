const fs = require('fs');
const glob = require('glob');
const mkdir = require('mkdirp');
const rimraf = require('rimraf');

const globSync = glob.sync;
const mkdirpSync = mkdir.sync;
// import Translator from './lib/translator'

const MESSAGES_PATTERN = './src/locales/output/**/*.json';
const LANG_DIR = './src/locales/';

// Aggregates the default messages that were extracted from the example app's
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app's default locale.
const defaultMessages = globSync(MESSAGES_PATTERN)
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

// For the purpose of this example app a fake locale: `en-UPPER` is created and
// the app's default messages are "translated" into this new "locale" by simply
// UPPERCASING all of the message text. In a real app this would be through some
// offline process to get the app's messages translated by machine or
// professional translators.
// let uppercaseTranslator = new Translator(text => text.toUpperCase())
// let uppercaseMessages = Object.keys(defaultMessages)
//   .map(id => [id, defaultMessages[id]])
//   .reduce((collection, [id, defaultMessage]) => {
//     collection[id] = uppercaseTranslator.translate(defaultMessage)
//     return collection
//   }, {})

mkdirpSync(LANG_DIR);
fs.writeFileSync(`${LANG_DIR}template.json`, JSON.stringify(defaultMessages, null, 2));
// fs.writeFileSync(
//   LANG_DIR + 'en-UPPER.json',
//   JSON.stringify(uppercaseMessages, null, 2)
// )
