const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];

items.push(async ({ dir }) => {
    const configXml = await fs.readFile(path.join(dir, 'config.xml'), { encoding: 'utf8' });
    const configDom = new DOMParser().parseFromString(configXml, 'text/xml');
    
    const ios = Array.from(configDom.getElementsByTagName('platform'))
        .find(platform => platform.getAttribute('name') === 'ios');

    if (ios) {
        ['about:*', 'file:*'].forEach(origin => {
            if (!Array.from(ios.getElementsByTagName('access'))
                .some(access => access.getAttribute('origin') === origin)) {

                console.log('platform ios should have a:\n'
                    + '<platform name="ios">\n'
                    + '\t...\n'
                    + `\t<access origin="${origin}" />\n`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        ['about:', 'file:'].forEach(href => {
            if (!Array.from(ios.getElementsByTagName('allow-navigation'))
                .some(access => access.getAttribute('href') === href)) {

                console.log('platform ios should have a:\n'
                    + '<platform name="ios">\n'
                    + '\t...\n'
                    + `\t<allow-navigation href="${href}" />\n`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        [['DisallowOverscroll', true], ['webviewbounce', false]].forEach(([name, value]) => {
            if (!Array.from(ios.getElementsByTagName('preference'))
                .some(preference => preference.getAttribute('name') && name || preference.getAttribute('value') === value) ) {

                console.log('platform ios should have a:\n'
                    + '<platform name="ios">\n'
                    + '\t...\n'
                    + `\t<preference name="${name}" value="${value}" />\n\n`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        
    }
});


module.exports = items;
