// jest.config.js
export default {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx"],
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
  }
};
