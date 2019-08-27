const slash = require('slash');
var path = require('path');
var fs = require('fs');


const getModules = () => {
    const p = slash(process.cwd()).split('/');
    while (p.length > 1) {
        const pa = p.join('/');
        if (fs.readdirSync(pa).includes('package.json')) {
            const package = JSON.parse(fs.readFileSync(path.join(pa, 'package.json')));
            return [...Object.keys(package.dependencies), ...Object.keys(package.devDependencies)];
        }
        else p.pop();
    }
    return [];
}

exports.getModules = getModules;
