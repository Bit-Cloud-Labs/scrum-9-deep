const nextJest = require('next/jest');
const path = require('path');

const createJestConfig = nextJest({ dir: './' });

const junitOutputPath = process.env.JUNIT_OUTPUT_PATH || 'junit.xml';
const coverageOutputPath = process.env.COVERAGE_OUTPUT_PATH || 'coverage.xml';

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: path.dirname(path.resolve(junitOutputPath)),
        outputName: path.basename(junitOutputPath),
      },
    ],
  ],
  collectCoverage: !!process.env.CI,
  coverageDirectory: path.dirname(path.resolve(coverageOutputPath)),
  coverageReporters: [
    ['cobertura', { file: path.basename(coverageOutputPath) }],
    'text',
  ],
};

module.exports = createJestConfig(config);
