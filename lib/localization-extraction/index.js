const fs = require('fs-extra');
const esprima = require('esprima');
const globby = require('globby');
const camelCase = require('camelcase');

const stringFilter = ({ type, value }) => type === 'String' && format(value).length > 1;

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const format = string => camelCase(
    camelCase(string)
        .replace(/[^a-zA-Z0-9]/g, '')
);

const identifierFilter = ({ type }) => type === 'Identifier';

module.exports = async ({ cwd, glob, output }) => {
    const files = await globby(glob, { cwd });

    await Promise.all(files.map(async file => {
        let contents = await fs.readFile(file, { encoding: 'utf8' });

        const tokens = esprima
            .tokenize(contents)

        const stringTokens = tokens
            .filter(({ type, value }, i, self) => type === 'String' && format(value).length > 1 && !(
                (i > 1 && self[i - 2].type === 'Identifier' && self[i - 2].value === 'require')
                || (i > 0 && self[i - 1].type === 'Keyword' && self[i - 1].value === 'import'))
            )

        const identifierTokens = tokens
            .filter(identifierFilter)

        const keys = Object.assign({}, ...identifierTokens.map(({ value }) => ({ [value]: true })));
        const values = {};

        stringTokens
            .map(({ value }) => value)
            .filter(onlyUnique)
            .forEach((value) => {

                const f = '__' + format(value);
                let name = f;
                let count = 2;
                while (name in keys || name in identifierTokens) {
                    name = f + '_' + (count++);
                }
                keys[name] = true;
                values[value] = name;
            });

        stringTokens.forEach(token => {
            while (contents.indexOf(token.value) !== -1) {
                contents = contents.replace(token.value, values[token.value]);
            }
        });

        contents = `const {\n${Object.values(values).map(key => '\t' + key).join(',\n')}\n} = ;\n\n` + contents;

        await fs.writeFile(file, contents, { encoding: 'utf8' });
    }));

    
}
