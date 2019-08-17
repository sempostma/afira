const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const items = [];
const os = require('os')

items.push(async ({ dir }) => {
    // check gitignore

    if (!await fs.exists(path.resolve(dir, '.gitignore'))) {
        return;
    }

    const text = await fs.readFile(path.join(dir, '.gitignore'), { encoding: 'utf8' });

    const lines = text.split(os.EOL).map(x => x.trim());

    const ignoresPlatforms = ['platforms', 'platforms/'].some(entry => lines.includes(entry));
    const ignoresPlugins = ['plugins', 'plugins/'].some(entry => lines.includes(entry));
    const ignoresNodemodules = ['node_modules', 'node_modules/'].some(entry => lines.includes(entry));

    if (!ignoresPlugins) {
        console.error('You have to ignore the cordova plugins directory by adding: "plugins/" to your .gitignore.\n'
            + 'After adding that line run:\n\n'
            + '\tgit rm -r --cached && git add .\n\n' )
    }

    if (!ignoresPlatforms) {
        console.error('You have to ignore the cordova platforms directory by adding: "platforms/" to your .gitignore.\n'
            + 'After adding that line run:\n\n'
            + '\tgit rm -r --cached && git add .\n\n' )
    }

    if (!ignoresNodemodules) {
        console.error('You have to ignore the node_modules directory by adding: "node_modules/" to your gitignore.\n'
            + 'After adding that line run:\n\n'
            + '\tgit rm -r --cached && git add .\n\n' )
    }
});


module.exports = items;
