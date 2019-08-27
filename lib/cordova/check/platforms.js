
const fs = require('fs-extra');
const path = require('path');
const { DOMParser } = require('xmldom');
const os = require('os');

const items = [];

items.push(async ({ dir }) => {
    const iosFolder = path.join(dir, 'platforms', 'ios')
    const podsFolder = path.join(iosFolder, 'Pods');

    if (await fs.exists(iosFolder) && !await fs.exists(podsFolder)) {
        console.warn('Pods have not been installed in platforms/ios. '
            + 'Please install CacaoPods by running this command in the platforms/ios directory:\n\n'
            + '\tpod setup\n')
    }
});

items.push(async ({ dir }) => {
    const androidFolder = path.join(dir, 'platforms', 'android');
    const releaseSigning = path.join(androidFolder, 'release-signing.properties')
    const configXml = await fs.readFile(path.join(dir, 'config.xml'), { encoding: 'utf8' });
    const configDom = new DOMParser().parseFromString(configXml, 'text/xml');

    const [widget] = Array.from(configDom.getElementsByTagName('widget'));
    if (widget) {
        if (widget.hasAttribute('id')) {
            const [com, company, project] = widget.getAttribute('id').split('.');
            if (project) {
                const keyStoreName = project.toLowerCase();

                if (await fs.exists(androidFolder)) {

                    const exampleFormat = `\tstoreFile=${keyStoreName}.jks\n`
                        + `\tstoreType=jks\n`
                        + `\tkeyAlias=${keyStoreName}\n`
                        + `\t// if you don't want to enter the password at every build, you can store it with this\n`
                        + `\tkeyPassword=********\n`
                        + `\tstorePassword=********\n`;

                    if (!await fs.exists(releaseSigning)) {
                        console.warn('You have no "release-signing.properties" in your platforms/android.\n'
                            + `Please specifiy the file in the following format:\n\n`
                            + exampleFormat
                        );
                    }
                    
                    else {
                        const { storeFile, storeType, keyAlias, keyPassword, storePassword } = Object.assign({}, 
                            ...(await fs.readFile(releaseSigning, { encoding: 'utf8' }))
                                .split(os.EOL)
                                .filter(line => line.trim())
                                .map(line => line.split('='))
                                .map(([key, value]) => ({ [key.trim()]: value.trim() }))
                        );

                        if (!storeFile) console.error('You haven\'t defined "storeFile" in your "release-signing.properties" file.');
                        if (!storeType) console.error('Please specify is storeType in your "release-signing.properties" file');
                        if (!keyAlias) console.error('Please specify a keyAlias in your "release-signing.properties" file');
                        if (!keyPassword) console.error('Please specify a keyPassword in your "release-signing.properties" file');
                        if (!storePassword) console.error('Please specify a storePassword in your "release-signing.properties" file');
                    }
                }
            } else {
                console.error('Incorrectly formatted id attribute on "widget" tag in config.xml');
            }
        } else {
            console.error('config.xml widget tag is missing the id (com.company.project) attribute.');
        }
    } else {    
        console.error('config.xml is missing the "widget" tag.');
    }

    
});

module.exports = items;