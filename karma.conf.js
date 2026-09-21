// Karma configuration for the workspace.
//
// @angular/build:karma passes this file straight to Karma when angular.json
// sets `karmaConfig`. The builder then adds only its own asset and polyfill
// plugins. Everything else — the frameworks, the plugins and the reporters —
// must be declared here.
//
// ChromeHeadlessNoSandbox is necessary in the Docker container:
//   --no-sandbox            the container runs as root, and the Chromium
//                           sandbox cannot start there
//   --disable-dev-shm-usage /dev/shm is 64 MB by default in Docker, which is
//                           too small for Chromium
//   --disable-gpu           there is no GPU in the container

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
        ],
        client: {
            jasmine: {},
            clearContext: false,
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' },
            ],
        },
        reporters: ['progress', 'kjhtml'],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                ],
            },
        },
        restartOnFileChange: true,
    });
};
