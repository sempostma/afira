const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];

items.push(async ({ dir }) => {
    const configXml = await fs.readFile(path.join(dir, 'config.xml'), { encoding: 'utf8' });
    const configDom = new DOMParser().parseFromString(configXml, 'text/xml');
    
    const ios = Array.from(configDom.getElementsByTagName('platform'))
        .find(platform => platform.getAttribute('name') === 'ios');

    const android = Array.from(configDom.getElementsByTagName('platform'))
        .find(platform => platform.getAttribute('name') === 'android');

    if (ios) {
        ['about:*', 'file:*'].forEach(origin => {
            if (!Array.from(ios.getElementsByTagName('access'))
                .some(access => access.getAttribute('origin') === origin)) {

                console.log('platform ios should have:\n\n'
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

                console.log('platform ios should have:\n\n'
                    + '<platform name="ios">\n'
                    + '\t...\n'
                    + `\t<allow-navigation href="${href}" />\n`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        [
            ['DisallowOverscroll', 'true'], 
            ['webviewbounce', 'false'],
            ['StatusBarStyle', 'value', true],
            ['BackupWebStorage', 'local']
        ]
        .forEach(([name, value, optional]) => {
            if (!Array.from(ios.getElementsByTagName('preference'))
                .some(preference => preference.getAttribute('name') === name 
                    && (preference.getAttribute('value') === value || optional)) ) {

                console.log('platform ios should have:\n\n'
                    + '<platform name="ios">\n'
                    + '\t...\n'
                    + `\t<preference name="${name}" value="${value}" />`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        
    }

    if (android) {
        [
            ['StatusBarBackgroundColor', '#hexcode', true], 
        ]
        .forEach(([name, value, optional]) => {
            if (!Array.from(android.getElementsByTagName('preference'))
                .some(preference => preference.getAttribute('name') === name 
                    && (preference.getAttribute('value') === value || optional)) ) {

                console.log('platform ios should have:\n\n'
                    + '<platform name="android">\n'
                    + '\t...\n'
                    + `\t<preference name="${name}" value="${value}" />\n\n`
                    + '\t...\n'
                    + '</platform>\n');
            }
        });

        [
            ['android:usesCleartextTraffic', 'true']
        ]
        .forEach(([key, value]) => {
            if (!Array.from(android.getElementsByTagName('application'))
                .some(application => application.getAttribute(key) === value)) {
                    console.log('android should have:\n\n'
                        + '\t<edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">'
                        + `\t\t<application ${key}="${value}" />`
                        + '\t</edit-config>\n');
                }
        })
    }

    [
        ['StatusBarOverlaysWebView', 'true']
    ]
        .forEach(([name, value]) => {
        if (!Array.from(configDom.getElementsByTagName('preference'))
            .some(preference => preference.getAttribute('name') === name && preference.getAttribute('value') === value) ) {

            console.log('widget should have:\n'
                + `\t<preference name="${name}" value="${value}" />\n\n`);
        }
    });
});


module.exports = items;
