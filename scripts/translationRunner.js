// translationRunner.js
const manageTranslations = require('react-intl-translations-manager').default;
const compareByKey = require('react-intl-translations-manager/dist/compareByKey').default;
const {
  bold, yellow, red, green, cyan,
} = require('chalk');

const printResults = ({
  deleted, untranslated, added, sortKeys = true,
}) => {
  if (!(deleted.length || added.length || untranslated.length)) {
    console.log(green('  Perfectly maintained, no remarks!'));
    newLine();
  } else {
    if (deleted.length) {
      const items = sortKeys ? deleted.sort(compareByKey) : deleted;
      subheader('Deleted keys:');
      items.forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }

    if (untranslated.length) {
      const items = sortKeys ? untranslated.sort(compareByKey) : untranslated;
      subheader('Untranslated keys:');
      items.forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }

    if (added.length) {
      const items = sortKeys ? added.sort(compareByKey) : added;
      subheader('Added keys:');
      items.forEach(({ key, message }) => console.log(`  ${red(key)}: ${cyan(message)}`));
      newLine();
    }
  }
};

const newLine = () => console.log(' ');

const header = (title) => {
  console.log(bold.underline(title));
  newLine();
};

const subheader = title => console.log(title);

const footer = () => {
  newLine();
};

let error = '';

const printers = {
  printDuplicateIds: (duplicateIds) => {
    header('Duplicate ids:');
    if (duplicateIds.length) {
      error = 'duplicate id';
      duplicateIds.forEach((id) => {
        console.log('  ', `Duplicate message id: ${red(id)}`);
      });
    } else {
      console.log(green('  No duplicate ids found, great!'));
    }
    footer();
  },

  printLanguageReport: (langResults) => {
    if (langResults.report.untranslated.length > 0 || langResults.report.added.length > 0) {
      error = error || 'language translation is not done';
    }
    header(`Maintaining ${yellow(langResults.languageFilename)}:`);
    printResults({ ...langResults.report, sortKeys: true });
  },

  printNoLanguageFile: (langResults) => {
    error = error || 'no language file';
    subheader(`
      No existing ${langResults.languageFilename} translation file found.
      A new one is created.
    `);
  },

  printNoLanguageWhitelistFile: (langResults) => {
    subheader(
      ''`
      No existing ${langResults} file found.
      A new one is created.
    ```,
    );
  },
};

manageTranslations({
  messagesDirectory: 'src/locales/output',
  translationsDirectory: 'src/locales',
  whitelistsDirectory: 'src/locales/whitelist',
  languages: ['en', 'zh', 'zh-Hant-HK'], // any language you need
  overridePrinters: printers,
});

if (error) {
  console.log(red('Translation is not completed. Please check the red in the report'));
  console.log();
  process.exit(1);
}
