export default {
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js", // The global stub for weird files
    "\\.(css|less|sass|scss)$": "identity-obj-proxy", // The mock for style related files
    "^@/(.*)$": "<rootDir>/src/$1", // [optional] Are you using aliases?
  },
};
