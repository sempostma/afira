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

    if (!viewport) {
        console.error('A cordova project should have a viewport meta field. '
            + 'Preferebly: <meta name="viewport" content="user-scalable=no, '
            + 'initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, '
            + 'height=device-height, viewport-fit=cover">');

        process.exit(1);
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
