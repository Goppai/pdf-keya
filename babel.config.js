module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'false',
        corejs: 'core-js@3',
        targets: {
          chrome: 73,
        },
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', false],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src'],
      },
    ],
  ],
  overrides: [
    {
      test: /\.tsx?$/,
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],
    },
  ],
};
