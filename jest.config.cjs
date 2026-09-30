module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: { '\\.css$': '<rootDir>/tests/styleMock.cjs' },
  testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
  collectCoverageFrom: ['src/utils/**/*.js', 'src/hooks/**/*.js', 'src/components/ui/**/*.{js,jsx}', '!src/components/ui/index.js'],
  coverageDirectory: 'coverage',
  coverageThreshold: { global: { branches: 70, functions: 70, lines: 70, statements: 70 } },
};
