const items = require('./items');
const fs = require('fs-extra');
const path = require('path');

exports.doChecks = async ({ cwd }) => {
    const dir = await getCordovaDir(cwd);

    for(let i = 0; i < items.length; i++) {
        await items[i]({ dir });
    }
}

const getCordovaDir = async leafDir => {
    while(!(await isCordovaDir(leafDir))) {
        if (path.parse(leafDir).root !== leafDir) {
            leafDir = path.resolve(leafDir, '../')
        } else {
            console.error('This directory, and parent directories are not cordova projects. Cordova projects should have a config.xml file, and the platform, www and plugins directory.');
            throw new Error(1);
        }
    }
    return leafDir;
}

const isCordovaDir = async dir => {
    const files = await fs.readdir(dir);
    return files.some(file => file.indexOf('config.xml') !== -1)
        && files.some(file => file.indexOf('platforms') !== -1)
        && files.some(file => file.indexOf('www') !== -1)
        && files.some(file => file.indexOf('plugins') !== -1);
}

