
const fs = require('fs-extra');
const path = require('path');


exports.findFilesRecusively = async ({ parent = './', ignore, extensions, depth = 3 }) => {
    const recurse = async (parent, depth) => {
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
    return await recurse(parent, depth)
} 

