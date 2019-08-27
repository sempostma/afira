const program = require('commander');
const fs = require('fs-extra')
const path = require('path');
const sharp = require('sharp');
const terminalImage = require('terminal-image');
const package = require('./package.json');
const { findFilesRecusively } = require('./lib/files');
const { doChecks } = require('./lib/cordova/check');
const { searchFonts, listFonts, printFont, listIcons, getIcons, getName, getFilename } = require('./lib/fontpack');
const { DOMParser, XMLSerializer } = require('xmldom');

const rgen = require('./lib/rgen');

program
    .version(package.version)
    .name(package.name)
    .description(package.description);

program
    .command('accumulate')
    .description('Accumulates files with specific extensions into a single folder. Handy for backing up files.')
    .option('-d, --depth <number>', 'Depth to search for files', parseInt)
    .option('-o, --out <path>', 'Output path', path => path)
    .option('-e, --extensions <extensions>', 'Extensions to backup', extensions => (extensions || '').split(/\s*,\s*/))
    .option('-i, --ignore <ignore>', 'Directories to ignore', ignore => (ignore || '').split(/\s*,\s*/))
    .action(async function ({ depth, out, extensions = ['jks'], ignore = ['node_modules', '.git', 'bower_components',] }) {

        if (!depth || !out) throw new Error('"depth" and "out" have to be set.')

        const filesToBackup = await findFilesRecusively({ ignore, extensions, depth });

        filesToBackup.forEach(file => {
            console.log(`backing up "${file}"`);
            const outFile = path.resolve('./', out, path.basename(file));
            fs.copy(file, outFile);
        });

        console.log(`Done! Backed up ${filesToBackup.length} files.`);
    });

program
    .command('cordova:check')
    .description('Run production checks for a specific cordova project. Must be run from within a cordova project.')
    .action(async function () {
        doChecks({ cwd: process.cwd() })
    });

program
    .command('fontpack [fontname] [icon]')
    .description('List fontpack.')
    .option('-l, --list', 'List of fontpacks or list of font pack icons.')
    .option('-o, --output <file>', 'Output icon.')
    .option('-f, --fill <color>', 'Fill color to use for this icon.')
    .option('-s, --stroke <color>', 'Stroke color to use for this icon.')
    .option('-w, --width <pixels>', 'Width of the image.')
    .option('-h, --height <pixels>', 'Height of the image.')
    .action(async function (fontName, iconName, cmdObj) {
        if (fontName) {
            if (iconName) {
                const icons = await getIcons({ fontName, iconName });

                const exactMath = icons.find(ic => 
                    getName(ic) === iconName.toLowerCase()
                    || getFilename(ic) === iconName.toLowerCase());

                if (!icons.length === 0) {
                    throw new Error(`Could not find icon ${iconName}.`);
                }

                else if (icons.length > 1 && !exactMath) {
                    console.log(`Found ${icons.length} icon${icons.length > 1 ? 's' : ''} with that name.`);
                    const display = icons.slice(0, 10).map(getName);
                    if (icons.length > 10) {
                        display.push('...');
                    }
                    console.log(display.join('\n'));
                } else {
                    const icon = icons.length > 1 ? exactMath : icons[0];

                    let svgString = icon.data.toString();
                    let xml = new DOMParser().parseFromString(svgString, 'image/svg+xml');

                    if (cmdObj.fill) {
                        const paths = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path'));
                        paths.forEach(p => p.setAttribute('fill', cmdObj.fill));
                    }

                    if (cmdObj.stroke) {
                        const paths = Array.from(xml.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path'));
                        paths.forEach(p => p.setAttribute('stroke', cmdObj.stroke));
                    }

                    if (cmdObj.width && !cmdObj.height) {
                        const ratio = +cmdObj.width / +xml.documentElement.getAttribute('width');
                        xml.documentElement.setAttribute('width', cmdObj.width);
                        xml.documentElement.setAttribute('height', 
                            xml.documentElement.getAttribute('height') * ratio);
                    }

                    else if (cmdObj.height && !cmdObj.width) {
                        const ratio = +cmdObj.height / +xml.documentElement.getAttribute('height');
                        xml.documentElement.setAttribute('height', cmdObj.height);
                        xml.documentElement.setAttribute('width', 
                            xml.documentElement.getAttribute('width') * ratio);
                    }

                    else if (cmdObj.width && cmdObj.height) {
                        xml.documentElement.setAttribute('width', cmdObj.width);
                        xml.documentElement.setAttribute('height', cmdObj.height);
                    }

                    svgString = new XMLSerializer().serializeToString(xml);

                    if (cmdObj.output) {
                        let filename = path.resolve(process.cwd(), cmdObj.output);

                        if (cmdObj.type === 'png' || filename.endsWith('.png')) {
                            if (!filename.includes('.')) filename += '.png';
                            await sharp(Buffer.from(svgString))
                                .png()
                                .toFile(filename);
                            console.log(`Wrote bitmap png file to "${filename}"`);
                        } else {
                            if (!filename.includes('.')) filename += '.svg';
                            filename = path.resolve(process.cwd(), filename);
                            await fs.writeFile(filename, svgString);
                            console.log(`Wrote vector svg file to "${filename}".`);
                        }
                    } else {
                        const buffer = await sharp(icon.data)
                            .resize(2000)
                            .png()
                            .toBuffer();

                        const encodedImage = await terminalImage.buffer(buffer);

                        console.log(encodedImage);

                        console.log(getName(icon));
                    }
                }
            } else {
                if (cmdObj.list) {
                    const list = await listIcons({ cwd: process.cwd(), fontName })

                    if (!list) {
                        throw new Error(`Font with name ${fontName} was not found.`);
                    }

                    list.forEach((item, i) => console.log(i, item));
                } else {
                    const font = searchFonts({ cwd: process.cwd(), fontName })

                    if (!font) {
                        throw new Error(`Font with name ${fontName} was not found.`);
                    }

                    printFont(font);
                }
            }
        } else {
            if (cmdObj.list) {
                listFonts()
            } else {
                console.error('No arguments or options specified.');
                process.exit(1);
            }
        }
    });


program
    .command('reactgen:component <name>')
    .alias('rgen:com')
    .description('Generates a react component.')
    .action(async function (name, cmdObject) {
        await rgen.component({ dir: process.cwd(), name })
    });

program
    .command('reactgen:container <name>')
    .alias('rgen:con')
    .description('Generates a react container.')
    .action(async function (name, cmdObject) {
        await rgen.container({ dir: process.cwd(), name })
    });


program
    .command('reactgen:redux-container <name>')
    .alias('rgen:rrc')
    .description('Generates a react redux container.')
    .action(async function (name, cmdObject) {
        await rgen.reduxContainer({ dir: process.cwd(), name })
    });

program
    .command('reactgen:redux-actions <name>')
    .alias('rgen:rra')
    .description('Generates a react redux actions.')
    .action(async function (name, cmdObject) {
        await rgen.reduxActions({ dir: process.cwd(), name })
    });


program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);

// Check the program.args obj
var NO_COMMAND_SPECIFIED = program.args.length === 0;

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
}
