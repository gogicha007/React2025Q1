/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.tsx',
    '!**/node_modules/**',
    '!**/*.test.tsx',
    '!app/root.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      statements: 70,
      functions: 70,
      branches: 70,
      lines: 70,
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {},
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      'ts-jest',
      {
        useESM: true,
      }
    ],
    '^.+\\.(css)$': '<rootDir>/jest-config/style-mock.cjs',
  },
};

module.exports = config;