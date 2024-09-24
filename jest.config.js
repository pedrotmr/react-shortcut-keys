module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!@testing-library/react)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
