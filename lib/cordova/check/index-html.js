const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];


items.push(async ({ dir }) => {
    // check viewport

    const indexHtml = await fs.readFile(path.join(dir, 'www', 'index.html'), { encoding: 'utf8' });
    const indexHtmlDom = new DOMParser().parseFromString(indexHtml, 'text/html');

    const viewport = Array.from(indexHtmlDom.getElementsByTagName('meta'))
        .find(meta => meta.getAttribute('name') === 'viewport');

    const iosNavStyle = Array.from(indexHtmlDom.getElementsByTagName('meta'))
        .find(meta => meta.getAttribute('name') === 'apple-mobile-web-app-status-bar-style');

    if (!iosNavStyle) {
        console.error('A cordova project index.html file should have a apple-mobile-web-app-status-bar-style meta field. '
            + 'Preferebly: <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
            + 'Link: https://stackoverflow.com/questions/39749015/apple-mobile-web-app-status-bar-style-in-ios-10');
    }

    if (!viewport) {
        console.error('A cordova project index.html file should have a viewport meta field. '
            + 'Preferebly: <meta name="viewport" content="user-scalable=no, '
            + 'initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, '
            + 'height=device-height, viewport-fit=cover">\n'
            + 'Link: https://blog.phonegap.com/displaying-a-phonegap-app-correctly-on-the-iphone-x-c4a85664c493');
    }

    const viewportContent = Object.assign({}, ...(viewport.getAttribute('content') || '')
        .split(/\s*,\s*/)
        .filter(kvp => !!kvp)
        .map(kvp => kvp.split('='))
        .map(([key, value]) => ({[ key.trim()]: value.trim() })));

    const hasError = [
        ['user-scalable', 'no'],
        ['initial-scale', '1'],
        ['maximum-scale', '1'],
        ['minimum-scale', '1'],
        ['viewport-fit', 'cover'],
        ['width', 'device-width'],
        ['height', 'device-height'],
    ].some(([key, desiredValue]) => {
        const value = viewportContent[key];

        if (value !== desiredValue) {
            console.error(`Viewport variable "${key}" was "${value}". This should be: "${desiredValue}"`)
        }
        
        return value !== desiredValue
    })
});


module.exports = items;
