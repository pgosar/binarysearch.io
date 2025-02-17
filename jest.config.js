/** @type {import('jest').Config} */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Point to the directory containing your Next.js app
  // (where next.config.js and package.json are located)
  dir: './',
});

const customJestConfig = {
  // If using TypeScript, you can uncomment the next line:
  // preset: 'ts-jest',

  // If you have path aliases in tsconfig.json, map them here. Example:
  // moduleNameMapper: {
  //   '^@/components/(.*)$': '<rootDir>/components/$1',
  // },

  // The test environment that will be used for testing
  // 'jsdom' is standard for front-end tests, but you can override in specific test files
  testEnvironment: 'jest-environment-jsdom',

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Run some code after the test environment is set up (if needed)
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Collect coverage from your server models (Zod schemas) and any front-end files you want
  collectCoverageFrom: [
    '<rootDir>/app/server/api/models/**/*.{js,ts}', // Add coverage for your Zod schemas
    '<rootDir>/components/**/*.{js,ts,jsx,tsx}',    // Example for a typical Next.js folder
    '<rootDir>/pages/**/*.{js,ts,jsx,tsx}',         // Example for pages
  ],

  // Optional coverage thresholds
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};

// Wrap your custom config with the Next.js defaults
module.exports = createJestConfig(customJestConfig);
