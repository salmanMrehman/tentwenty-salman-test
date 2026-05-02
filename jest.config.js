/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");

// Use Next.js's jest helper so SWC compiles TS/TSX and aliases are wired up.
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@types-app/(.*)$": "<rootDir>/src/types/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@mocks/(.*)$": "<rootDir>/src/mocks/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

module.exports = createJestConfig(customJestConfig);
