const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];
const os = require('os');
const files = require('../../files');

items.push(async ({ dir }) => {
    // check gitignore

    const cssFiles = await files.findFilesRecusively({ ignore: [], extensions: ['css'], depth: Infinity, parent: path.join(dir, 'www') })

    const cssContents = await Promise.all(cssFiles.map(async file => {
        return await fs.readFile(file, { encoding: 'utf8' });
    }));
});


module.exports = items;
