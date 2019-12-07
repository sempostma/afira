#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra')
const path = require('path');

const {
    package,
    findFilesRecusively,
    doCordovaChecks,
    imageColourise,
    fontpackInterface,
    rgen,
    localizationExtraction,
    httpDiagnose,
    processCommand
} = require('../index');

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
        doCordovaChecks({ cwd: process.cwd() })
    });

program
    .command('img:colourise [img] [color] [output]')
    .alias('img:c')
    .description('Colourise simple transparent glyphs.')
    .action(async (img, color, output) => {
        console.log(img, color, output)
        const cwd = process.cwd();
        await imageColourise({ img, color, output, cwd });
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
    .option('-r, --rounded <color>', 'Created a rounded image.')
    .option('-br, --border-radius <pixels', 'Rounded image border radius.')
    .option('-b, --background <color>', 'Image background.')
    .option('-t --type <type>', 'Image type, for example "png".')
    .option('-m, --margins <color>', 'Margins of the image.')

    .action(async function (fontName, iconName, cmdObj) {
        await fontpackInterface({ fontName, iconName, ...cmdObj })
    });

program
    .command('localization:extraction <glob> <locales dir>')
    .alias('l:e')
    .description('Extracts strings from javascript files.')
    .action(async (glob, output) => {
        await localizationExtraction({ cwd: process.cwd(), glob, output })
    })

program
    .command('reactgen:component <name>')
    .alias('rgen:com')
    .description('Generates a react component.')
    .action(async function (name) {
        await rgen.component({ dir: process.cwd(), name })
    });

program
    .command('reactgen:container <name>')
    .alias('rgen:con')
    .description('Generates a react container.')
    .action(async function (name) {
        await rgen.container({ dir: process.cwd(), name })
    });


program
    .command('reactgen:redux-container <name>')
    .alias('rgen:rrc')
    .description('Generates a react redux container.')
    .action(async function (name) {
        await rgen.reduxContainer({ dir: process.cwd(), name })
    });

program
    .command('reactgen:redux-actions <name>')
    .alias('rgen:rra')
    .description('Generates a react redux actions.')
    .action(async function (name) {
        await rgen.reduxActions({ dir: process.cwd(), name })
    });


program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program
    .command('process [urls...]')
    .option('-o, --out <out>', 'Output directory')
    .option('-r, --root <root>', 'Root element')
    .option('-i, --imagedir <imagedir>', 'Image directory')
    .option('-p, --publicimagepath <publicimagepath>', 'Public path to images')
    .option('-c, --crawl', 'Recursively crawl all of the pages linked to this page.')
    .option('-f, --frontmatter', 'Include some common front matter entries in YAML format.')
    .action(processCommand)

program
    .command('http-diagnose [url]')
    .action(async (url) => {
        await httpDiagnose({ url })
    })

program.parse(process.argv);

// Check the program.args obj
var NO_COMMAND_SPECIFIED = program.args.length === 0;

// Handle it however you like
if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help();
}
