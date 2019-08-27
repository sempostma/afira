
const path = require('path');
const pckg = require('../package.json');
const fs = require('fs-extra');

exports.appDirPromise = new Promise((resolve, reject) => {
    const appName = pckg.name;
    var plat = process.platform;

    var homeDir = process.env[(plat == 'win32') ? 'USERPROFILE' : 'HOME'];
    var appDir;

    if(plat == 'win32') {
        appDir = path.join(homeDir, 'AppData', appName);
    }
    else {
        appDir = path.join(homeDir, '.' + appName);
    }

    fs.ensureDir(appDir).then(() => resolve(appDir)).catch(reject);
});
  