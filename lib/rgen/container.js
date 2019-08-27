var path = require('path');
var fs = require('fs');
const util = require('./util');

module.exports = async ({ dir, name }) => {
    const modules = util.getModules();

    fs.writeFileSync(path.join(dir, `${name}.js`),
        `import React, { Component } from 'react';
import ${name}Component from "../components/${name}/${name}";
import { compose } from 'redux';
import { connect } from 'react-redux';
import propTypes from 'prop-types'
${modules.includes('ladash') ? 'import get from \'lodash/get\';' : ''}
${modules.includes('react-router-dom') ? 'import { Link } from \'react-router-dom\';' : ''}

const enhance = component => component;

const enhancedComponent = enhance(${name}Component);

enhancedComponent.propTypes = {

}

enhancedComponent.defaultProps = {

}

export default enhancedComponent;
`, { flag: "wx" });

}
