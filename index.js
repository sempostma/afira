const package = require('./package.json');
const { findFilesRecusively } = require('./lib/files');
const { doChecks: doCordovaChecks } = require('./lib/cordova/check');
const imageColourise = require('./lib/img/colourise');
const fontpackInterface = require('./lib/fontpack/interface');
const rgen = require('./lib/rgen');
const localizationExtraction = require('./lib/localization-extraction');

module.exports = {
    package,
    findFilesRecusively,
    doCordovaChecks,
    imageColourise,
    fontpackInterface,
    rgen,
    localizationExtraction
};
