const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];

items.push(async ({ dir }) => {
    const configXml = await fs.readFile(path.join(dir, 'config.xml'), { encoding: 'utf8' });
    const configDom = new DOMParser().parseFromString(configXml, 'text/xml');

    const ios = Array.from(configDom.getElementsByTagName('platform'))
        .find(platform => platform.getAttribute('name') === 'ios');

    const iosDir = path.join(dir, 'platforms', 'ios')

    if (ios && await fs.exists(iosDir)) {
        const name = configDom.getElementsByTagName('widget')[0].getElementsByTagName('name')[0].textContent;

        const plistName = `${name}-Info.plist`

        const plistDir = path.join(iosDir, name, plistName);

        const pListXml = await fs.readFile(plistDir, { encoding: 'utf8' });

        const plistDom = new DOMParser().parseFromString(pListXml);

        const dict = plistDom.getElementsByTagName('dict')[0];

        const nonExamptEncyption = Array.from(dict.getElementsByTagName('key'))
            .find(x => x.textContent === 'ITSAppUsesNonExemptEncryption');

        const isValidSetToFalse = nonExamptEncyption 
            && nextElementSibling(nonExamptEncyption) 
            && nextElementSibling(nonExamptEncyption).tagName === 'false'

        if (!isValidSetToFalse) {
            console.warn(`${plistName} doesn't contain <key>ITSAppUsesNonExemptEncryption</key><false />.\n`
                + 'Make sure you meet the appropriate requirments.\n'
                + 'Link: https://stackoverflow.com/questions/44401899/app-uses-https-what-is-the-correct-value-of-itsappusesnonexemptencryption/46691418#46691418\n');
        }

        const uiStatusBarStyle = Array.from(dict.getElementsByTagName('key'))
            .find(x => x.textContent === 'UIStatusBarStyle')

        if (!uiStatusBarStyle) {
            console.error(`${plistName} doesn't contain <key>UIStatusBarStyle</key><string>{style value}</string>`);
        }

        const uIViewControllerBasedStatusBarAppearance = Array.from(dict.getElementsByTagName('key'))
            .find(x => x.textContent === 'UIViewControllerBasedStatusBarAppearance');

        const isValidUIViewControllerBasedStatusBarAppearance = uIViewControllerBasedStatusBarAppearance 
            && nextElementSibling(uIViewControllerBasedStatusBarAppearance) 
            && nextElementSibling(uIViewControllerBasedStatusBarAppearance).tagName === 'false'

        if (!isValidUIViewControllerBasedStatusBarAppearance) {
            console.error(`${plistName} doesn't contain <key>UIViewControllerBasedStatusBarAppearance</key><false />`);
        }

    }

});

function nextElementSibling(el) {
    while ((el = el.nextSibling)) {
      if (el.nodeType === 1) {
          return el;
      }
    }
    return null;
}

module.exports = items;
