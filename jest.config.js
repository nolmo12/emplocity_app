module.exports = {
    testEnvironment: "jsdom",
    testRegex: "resources/js/test/.*.test.js$",
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
    },
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "identity-obj-proxy",
        "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    },
};
