var path = require('path');
var fs = require('fs');
const util = require('./util');

module.exports = async ({ dir, name }) => {
    const modules = util.getModules();

    fs.mkdirSync(path.join(dir, name))
    fs.writeFileSync(path.join(dir, `${name}/${name}.js`),
        `import React, { useState, useEffect } from 'react';
import styles from './${name}.module.css';
import propTypes from 'prop-types';
${modules.includes('clsx') ? 'import clsx from \'clsx\';' : ''}
${modules.includes('react-router-dom') ? 'import { Link } from \'react-router-dom\';' : ''}
${modules.includes('lodash') ? 'import get from \'lodash/get\';' : ''}
${modules.includes('onsenui') ? 'import * as ons from \'onsenui\';' : ''}
${modules.includes('react-onsenui') ? 'import {} from \'react-onsenui\';' : ''}

const ${name} = () => {
    return (
        <div className={styles.${name}}>
            ${name} Component
        </div>
    );
}

${name}.propTypes = {

}

${name}.defaultProps = {

}

export default ${name};
`, { flag: "wx" });
    fs.writeFileSync(path.join(dir, `${name}/${name}.module.css`), `
.${name} {
    
}`, { flag: "wx" });
    fs.writeFileSync(path.join(dir, `${name}/${name}.test.js`), `
                import React from 'react';
import ReactDOM from 'react-dom';
import ${name} from './${name}';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<${name} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
`, { flag: "wx" });
}


