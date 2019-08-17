const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];
const os = require('os');
const files = require('../../files');

items.push(async ({ dir }) => {
    // check gitignore

    const jsFiles = await files.findFilesRecusively({ ignore: [], extensions: ['js'], depth: Infinity, parent: path.join(dir, 'www') })

    const jsContents = await Promise.all(jsFiles.map(async file => {
        return await fs.readFile(file, { encoding: 'utf8' });
    }));

    const packageJson = JSON.parse(await fs.readFile(path.join(dir, 'package.json'),'utf8'));

    if ('onsenui' in packageJson.dependencies || 'onsenui' in packageJson.devDependencies) {
        if (!/onsflag-iphonex-portrait/.test(jsContents.join(''))) {
            console.error('JS should contain\n\n'
                + 'if (ons.platform.isIPhoneX() || window.location.href.includes(\'iphone-x\')) { // Utility function'
                + '\t// Add empty attribute to the <html> element'
                + '\tdocument.documentElement.setAttribute(\'onsflag-iphonex-portrait\', \'\');'
                + '}\n');
        }

        if(!/ons.enableAutoStatusBarFill\(\)/.test(jsContents.join(''))) {
            console.error('JS should contain\n\n'
                + 'if (window.location.protocol === \'file:\') {\n'
                + '\tons.enableAutoStatusBarFill();'
                + '}\n');
        }
    }

    console.log('Unable to change statusbar text color after changing the StatusBarStyle? Check out this answer: https://stackoverflow.com/questions/20062186/white-status-bar-in-ios-phonegap/20088939#20088939');
    
});


module.exports = items;
