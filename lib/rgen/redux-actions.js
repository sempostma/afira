const camelCase = require('camelcase');
var path = require('path');
var fs = require('fs');
const util = require('./util');

module.exports = async ({ dir, name }) => {
    const modules = util.getModules();

    const pascal = camelCase(name, {pascalCase: true});
    const camel = camelCase(name);
    const upCase = name.toUpperCase();


    fs.writeFileSync(path.join(dir, `${name}.js`),
        `import {
    fetch${pascal}s as fetch${pascal}sFromService,
    put${pascal} as put${pascal}FromService,
    post${pascal} as post${pascal}FromService,
    delete${pascal} as delete${pascal}FromService
} from '<path to service>';

export const FETCH_${upCase}S = 'FETCH_${upCase}S';
export const FETCH_${upCase}S_PENDING = 'FETCH_${upCase}S_PENDING';
export const FETCH_${upCase}S_FULFILLED = 'FETCH_${upCase}S_FULFILLED';
export const FETCH_${upCase}S_REJECTED = 'FETCH_${upCase}S_REJECTED';

/**
 * Fetches specific resources.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to the ${camel} service
 * @param {Array} options.path      Path passed to the ${camel} service. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const fetch${pascal} = ({ args = {}, path, path: [id] = [] }) => dispatch => dispatch({
    type: FETCH_${upCase}S,
    meta: { args, path },
    payload: fetch${pascal}FromService({
        args,
        path
    })
}).catch(console.error);

export const PUT_${upCase} = 'PUT_${upCase}';
export const PUT_${upCase}_PENDING = 'PUT_${upCase}_PENDING';
export const PUT_${upCase}_FULFILLED = 'PUT_${upCase}_FULFILLED';
export const PUT_${upCase}_REJECTED = 'PUT_${upCase}_REJECTED';

/**
 * Update a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to the ${camel} service
 * @param {Array} options.path      Path passed to the ${camel} service. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @param {*} options.payload       Payload passed to ${camel}.
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const put${pascal} = ({ args = {}, contents, path, path: [id] = [] }) => dispatch => dispatch({
    type: PUT_${upCase},
    meta: { args, path, contents },
    payload: put${pascal}FromService({
        args,
        path,
        contents
    })
}).catch(console.error);


export const POST_${upCase} = '${upCase}_${upCase}';
export const POST_${upCase}_PENDING = '${upCase}_${upCase}_PENDING';
export const POST_${upCase}_FULFILLED = '${upCase}_${upCase}_FULFILLED';
export const POST_${upCase}_REJECTED = '${upCase}_${upCase}_REJECTED';

/**
 * Creates a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to ${camel}
 * @param {Array} options.path      Path passed to ${camel}. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @param {*} options.contents      Content passed to ${camel}.
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const post${pascal} = ({ args = {}, contents, path, path: [id] = [] }) =>  dispatch => dispatch({
    type: POST_${upCase},
    meta: { args, path, contents },
    payload: post${pascal}FromService({
        args,
        path,
        contents
    })
}).catch(console.error);

export const DELETE_${upCase} = 'DELETE_${upCase}';
export const DELETE_${upCase}_PENDING = 'DELETE_${upCase}_PENDING';
export const DELETE_${upCase}_FULFILLED = 'DELETE_${upCase}_FULFILLED';
export const DELETE_${upCase}_REJECTED = 'DELETE_${upCase}_REJECTED';

/**
 * Deletes a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to ${camel}
 * @param {Array} options.path      Path passed to ${camel}. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const delete${pascal} = ({ args = {}, path, path: [id] = [] }) =>  dispatch => dispatch({
    type: DELETE_${upCase},
    meta: { args, path },
    payload: delete${pascal}FromService({
        args,
        path,
    })
}).catch(console.error);

export const CLEAR_${upCase}S = 'CLEAR_${upCase}S';

/**
 * Clear all resources from the redux store.
 */
export const clear${pascal} = () => ({ type: CLEAR_${upCase}S });

`, { flag: "wx" });

}





