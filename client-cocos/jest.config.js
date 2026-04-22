module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: { '^cc$': '<rootDir>/tests/__mocks__/cc.ts' },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['assets/scripts/**/*.ts'],
};
