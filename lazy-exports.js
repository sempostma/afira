
 // don't cache because require.cache already takes care of this.
const moduleExports = {
    package: () => require('./package.json'),
    findFilesRecusively: () => require('./lib/files').findFilesRecusively,
    doCordovaChecks: () => require('./lib/cordova/check').doChecks,
    imageColourise: () => require('./lib/img/colourise'),
    fontpackInterface: () => require('./lib/fontpack/interface'),
    rgen: () => require('./lib/rgen'),
    localizationExtraction: () => require('./lib/localization-extraction'),
    httpDiagnose: () => require('./lib/http-diagnose'),
    processCommand: () => require('./lib/process'),
    soundcloud: () => require('./lib/soundcloud')
};

module.exports = moduleExports
