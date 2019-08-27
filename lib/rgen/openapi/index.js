const yaml = require('js-yaml');
const fs = require('fs-extra');


module.exports = async ({ dir, openApiDefinitionUri }) => {
    let definition = '';
    if (openApiDefinitionUri.starsWith('http')) {
        if (openApiDefinitionUri.endsWith('.json')) {
            definition = await fetch(openApiDefinitionUri)
                .then(res => res.json());
        } else if (openApiDefinitionUri.endsWith('.yaml')) {
            const content = await fetch(openApiDefinitionUri).then(res => res.text());
            definition = yaml.safeLoad(content);
        } else {
            console.error('Openapi definition file should end with .json or .yaml');
            return null;
        }
    }
}

