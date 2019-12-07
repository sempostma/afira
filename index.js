const package = require('./package.json');
const { findFilesRecusively } = require('./lib/files');
const { doChecks: doCordovaChecks } = require('./lib/cordova/check');
const imageColourise = require('./lib/img/colourise');
const fontpackInterface = require('./lib/fontpack/interface');
const rgen = require('./lib/rgen');
const httpDiagnose = require('./lib/http-diagnose');
const localizationExtraction = require('./lib/localization-extraction');
const processCommand = require('./lib/process');

module.exports = {
    package,
    findFilesRecusively,
    doCordovaChecks,
    imageColourise,
    fontpackInterface,
    rgen,
    localizationExtraction,
    httpDiagnose,
    processCommand
};
