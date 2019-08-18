const { DOMParser } = require('xmldom');
const fs = require('fs-extra');
const path = require('path');
const indexHtmlChecks = require('./index-html');
const platformsChecks = require('./platforms');
const configXmlChecks = require('./config-xml');
const gitIgnoreChecks = require('./gitignore');
const cssChecks = require('./css');
const infoPlistChecks = require('./ios-plist');

const items = [
    ...indexHtmlChecks,
    ...platformsChecks,
    ...configXmlChecks,
    ...gitIgnoreChecks,
    ...cssChecks,
    ...infoPlistChecks
];

items.push(async ({ dir }) => {
    // test config xml

    const configXml = await fs.readFile(path.join(dir, 'config.xml'), { encoding: 'utf8' });
    const configDom = new DOMParser().parseFromString(configXml, 'text/xml');


});


items.push(async ({ dir }) => {
    // check www/index.html 

    const indexHtml = await fs.readFile(path.join(dir, 'www', 'index.html'), { encoding: 'utf8' });
    const indexHtmlDom = new DOMParser().parseFromString(indexHtml, 'text/html');

})

module.exports = items;
