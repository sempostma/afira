const program = require('commander');
const fs = require('fs-extra')
const path = require('path');

const package = require('./package.json');

program
    .version(package.version)
    .name(package.name)
    .description(package.description);

program
    .command('backup')
    .option('-d, --depth <number>', 'Depth to search for android .jks files', parseInt)
    .option('-o, --out <path>', 'Output path', path => path)
    .option('-e, --extensions <extensions>', 'Extensions to backup', extensions => (extensions || '').split(/\s*,\s*/))
    .option('-i, --ignore <ignore>', 'Directories to ignore', ignore => (ignore || '').split(/\s*,\s*/))
    .action(async function({ depth, out, extensions = ['jks'], ignore = ['node_modules', '.git'] }) {

        const recurse = async (parent = './', depth = 3) => {
            const files = [];
            const dirs = await fs.readdir(parent);
            await Promise.all(dirs.map(async dir => {
                dir = path.resolve(parent, dir);
                const stat = await fs.lstat(dir);
                if (depth > 0 && stat.isDirectory() && stat.isSymbolicLink() === false && ignore.every(d => dir !== d)) {
                    files.push(...await recurse(dir, depth - 1))
                } else if (stat.isFile() && extensions.some(ext => dir.endsWith(`.${ext}`))) {
                    files.push(dir)
                }
            }));
        
            return files;
        }

        if (!depth || !out) console.error('"depth" and "out" have to be set.') || process.exit(1)

        const filesToBackup = await recurse('./', depth);

        filesToBackup.forEach(file => {
            console.log(`backing up "${file}"`);
            const outFile = path.resolve('./', out, path.basename(file));
            fs.copy(file, outFile);
        });

        console.log(`Done! Backed up ${filesToBackup.length} files.`);
    })



    

program.parse(process.argv);


