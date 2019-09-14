const iconpacks = require('./iconpacks-desc');
const util = require('util');
const fs = require('fs-extra');
const fetch = require('node-fetch');
const decompress = require('decompress');
const minimatch = require('minimatch');
const path = require('path');
const { appDirPromise } = require('../util');
var yazl = require("yazl");
var Spinner = require('cli-spinner').Spinner;

const getCacheDir = async () => {
    const dir = path.join(await appDirPromise, 'icon-packs');
    await fs.ensureDir(dir);
    return dir;
}

const getCacheFile = async ({ iconPack }) => {
    const dir = await getCacheDir();
    return path.join(dir, `${iconPack.id}.zip`);
}

const cacheFileExists = async ({ iconPack }) => {
    const cacheFile = await getCacheFile({ iconPack });
    return await fs.exists(cacheFile);
}

const getFilename = exports.getFilename = icon => {
    return icon.path.split('/').slice(-1)[0];
}

const getName = exports.getName = icon => {
    return getFilename(icon).split('.')[0];
}

const addToCache = async ({ iconPack, collection }) => {
    const cacheFile = await getCacheFile({ iconPack });

    if (await cacheFileExists({ iconPack })) {
        await fs.remove(cacheFile);
    }

    var zipfile = new yazl.ZipFile();

    zipfile.outputStream.pipe(
        fs.createWriteStream(cacheFile))
        .on("close", function () {

            console.log("done");
        });

    collection.forEach(file => {
        zipfile.addBuffer(file.data, file.path);
    });

    zipfile.end();

    console.log(cacheFile)
}

exports.searchFonts = ({ fontName }) => {
    searchFonts({ fontName })
}

const searchFonts = exports.searchFonts = ({ fontName }) => {
    const iconPack = iconpacks.icons.find(icon => {
        return [
            icon.name,
            icon.name.toLowerCase(),
            icon.name.replace(/\s/g, ''),
            icon.name.toLowerCase().replace(/\s/g, ''),
            icon.name.replace(/[\s-_]/g, ''),
            icon.name.toLowerCase().replace(/[\s-_]/g, ''),
            icon.id
        ].includes(fontName);
    });

    return iconPack;
}

exports.printFont = pack => {
    console.log(`Name: ${pack.name}\nId: ${pack.id}\nProject url: ${pack.projectUrl}\nLicense: ${pack.license}`);
}

exports.listFonts = () => {
    iconpacks.icons.map(pack => {
        exports.printFont(pack);
    });
};

const fetchFont = async ({ fontName }) => {
    const iconPack = searchFonts({ fontName });

    if (!iconPack) {
        throw new Error(`Could not find icon pack with name: ${fontName}`);
    }

    let collection;

    const cacheFile = await getCacheFile({ iconPack })

    const exists = await cacheFileExists({ iconPack });

    const valid = exists && (await fs.stat(cacheFile)).mtimeMs > Date.now() - 1000 * 60 * 60 * 24 * 7;

    if (valid) {
        collection = await decompress(cacheFile)
    } else {
        const spinner = new Spinner('Downloading font files... %s');
        spinner.start();

        const response = await fetch(`${iconPack.zipUrl}`);
        const buffer = await response.buffer();

        const files = await decompress(buffer);

        const baseDir = files[0].path.split('/')[0];

        const collections = iconPack.contents.map(content => {
            const matcher = path.join(baseDir, content.files);
            const contentFiles = files.filter(file => minimatch(file.path, matcher));
            return { files: contentFiles, formatter: content.formatter };
        });

        collection = [].concat(...collections.map(({ files }) => files));

        await addToCache({ iconPack, collection });

        spinner.stop(true);
    }

    return {
        collection,
        iconPack
    }
};

exports.getIcons = async ({ fontName, iconName }) => {
    const result = await fetchFont({ fontName });
    if (!result) return;

    const {
        collection,
        iconPack
    } = result;

    const icons = collection;

    const files = icons.filter(icon => icon.path.split('/').slice(-1)[0].includes(iconName));

    return files;
}

exports.listIcons = async ({ fontName }) => {
    const result = await fetchFont({ fontName });
    if (!result) return;

    const {
        collection,
        iconPack
    } = result;

    const icons = [];

    collection.map(file => {
            icons.push(
                file.path.split('/').slice(-1)[0].split('.')[0]
            )
    });

    return icons;
}
