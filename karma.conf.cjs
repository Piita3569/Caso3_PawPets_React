module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {
        pattern: 'src/pruebas/*.spec.js',
        included: false,
        watched: false
      }
    ],
    client: {
      captureConsole: true,
      jasmine: {
        random: false
      },
      args: []
    },
    customContextFile: 'karma-context.html',
    reporters: ['progress'],
    port: 9876,
    colors: true,
    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage']
      }
    },
    singleRun: true,
    autoWatch: false
  })
}
