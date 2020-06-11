const mapValues = require('lodash/mapValues')
const lazyExports = require('./lazy-exports')

module.exports = mapValues(lazyExports, value => value())