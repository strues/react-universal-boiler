module.exports = {
  // Modules can be explicitly auto-mocked using jest.mock(moduleName).
  // https://facebook.github.io/jest/docs/en/configuration.html#automock-boolean
  automock: false,

  // Respect Browserify's "browser" field in package.json when resolving modules.
  // https://facebook.github.io/jest/docs/en/configuration.html#browser-boolean
  browser: false,

  // This config option can be used here to have Jest stop running tests after the first failure.
  // https://facebook.github.io/jest/docs/en/configuration.html#bail-boolean
  bail: false,

  // The directory where Jest should store its cached dependency information.
  // https://facebook.github.io/jest/docs/en/configuration.html#cachedirectory-string
  // cacheDirectory: '/tmp/<path>', // [string]

  // Indicates whether the coverage information should be collected while executing the test.
  // Because this retrofits all executed files with coverage collection statements,
  // it may significantly slow down your tests.
  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoverage-boolean
  collectCoverage: true,

  // https://facebook.github.io/jest/docs/en/configuration.html#collectcoveragefrom-array
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],

  // https://facebook.github.io/jest/docs/en/configuration.html#coveragedirectory-string
  coverageDirectory: '<rootDir>/coverage',

  coveragePathIgnorePatterns: [
    '<rootDir>/(tools|build|docs|public)/',
    '/flow-typed/',
    '/__fixtures__/',
    '/node_modules/',
  ],

  // coverageReporters: [], // [array<string>]
  // coverageThreshold: {}, // [object]

  globals: {
    __CLIENT__: true,
    __SERVER__: true,
    __DEV__: true,
  },

  // https://facebook.github.io/jest/docs/en/configuration.html#mapcoverage-boolean
  // mapCoverage: false, // [boolean]

  // The default extensions Jest will look for.
  // https://facebook.github.io/jest/docs/en/configuration.html#modulefileextensions-array-string
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],

  // moduleDirectories: // [array<string>]

  // A map from regular expressions to module names that allow to stub out resources,
  // like images or styles with a single module.
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tools/jest/fileMock.js',
  },

  // modulePathIgnorePatterns: // [array<string>]
  // modulePaths: // [array<string>]
  // notify: false, // [boolean]
  // preset: // [string]
  // projects: // [array<string>]
  // clearMocks: // [boolean]
  // reporters: // [array<moduleName | [moduleName, options]>]
  // resetMocks: // [boolean]
  // resetModules: // [boolean]
  // resolver: // [string]
  // rootDir: // [string]
  // roots: // [array<string>]
  setupFiles: ['raf/polyfill'],
  // setupTestFrameworkScriptFile: // [string]
  // snapshotSerializers: // [array<string>]
  // testEnvironment: // [string]
  // testMatch: // [array<string>]
  testRegex: '.*.test\\.js',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__snapshots__',
    '<rootDir>/(tools|build|docs|public|flow-typed|coverage)/',
  ],
  // testResultsProcessor: // [string]
  // testRunner: // [string]
  // testURL: // [string]
  timers: 'fake',
  transform: {
    '\\.(js|jsx)$': '<rootDir>/tools/jest/transform.js',
    '^(?!.*\\.(js|jsx|json|css|less|styl|scss|sass|sss)$)': '<rootDir>/tools/jest/fileTransform.js',
  },

  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/(tools|build|docs|public|flow-typed|coverage)/',
  ],
  verbose: true,
};
