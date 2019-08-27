const program = require('commander');
const fs = require('fs-extra')
const path = require('path');

const package = require('./package.json');

const { findFilesRecusively } = require('./lib/files');
const { doChecks } = require('./lib/cordova/check');

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

        if (!depth || !out) console.error('"depth" and "out" have to be set.') || process.exit(1);

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
