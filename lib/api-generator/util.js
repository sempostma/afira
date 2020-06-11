const slash = require('slash');
var path = require('path');
var fs = require('fs');


const getModules = () => {
    const p = slash(process.cwd()).split('/');
    while (p.length > 1) {
        const pa = p.join('/');
        if (fs.readdirSync(pa).includes('package.json')) {
            const package = JSON.parse(fs.readFileSync(path.join(pa, 'package.json')));
            return Object.keys(package.dependencies || {});
        }
        else p.pop();
    }
    return [];
}

const getFile = name => {
    const p = slash(process.cwd()).split('/');
    let filePath = ''
    while (p.length > 1) {
        const pa = p.join('/');
        if (fs.readdirSync(pa).includes(name)) {
            filePath += name
            return filePath
        }
        else {
            p.pop();
            filePath += '../'
        }
    }
    return undefined
}

exports.getModules = getModules;
exports.getFile = getFile;
