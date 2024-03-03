module.exports = {
    testEnvironment: "jsdom",
    testRegex: "resources/js/test/.*.test.js$",
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
        "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
};
