import {
    fetchTests as fetchTestsFromService,
    putTest as putTestFromService,
    postTest as postTestFromService,
    deleteTest as deleteTestFromService
} from '<path to service>';

export const FETCH_TESTS = 'FETCH_TESTS';
export const FETCH_TESTS_PENDING = 'FETCH_TESTS_PENDING';
export const FETCH_TESTS_FULFILLED = 'FETCH_TESTS_FULFILLED';
export const FETCH_TESTS_REJECTED = 'FETCH_TESTS_REJECTED';

/**
 * Fetches specific resources.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to the test service
 * @param {Array} options.path      Path passed to the test service. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const fetchTest = ({ args = {}, path, path: [id] = [] }) => dispatch => dispatch({
    type: FETCH_TESTS,
    meta: { args, path },
    payload: fetchTestFromService({
        args,
        path
    })
}).catch(console.error);

export const PUT_TEST = 'PUT_TEST';
export const PUT_TEST_PENDING = 'PUT_TEST_PENDING';
export const PUT_TEST_FULFILLED = 'PUT_TEST_FULFILLED';
export const PUT_TEST_REJECTED = 'PUT_TEST_REJECTED';

/**
 * Update a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to the test service
 * @param {Array} options.path      Path passed to the test service. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @param {*} options.payload       Payload passed to test.
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const putTest = ({ args = {}, contents, path, path: [id] = [] }) => dispatch => dispatch({
    type: PUT_TEST,
    meta: { args, path, contents },
    payload: putTestFromService({
        args,
        path,
        contents
    })
}).catch(console.error);


export const POST_TEST = 'TEST_TEST';
export const POST_TEST_PENDING = 'TEST_TEST_PENDING';
export const POST_TEST_FULFILLED = 'TEST_TEST_FULFILLED';
export const POST_TEST_REJECTED = 'TEST_TEST_REJECTED';

/**
 * Creates a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to test
 * @param {Array} options.path      Path passed to test. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @param {*} options.contents      Content passed to test.
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const postTest = ({ args = {}, contents, path, path: [id] = [] }) =>  dispatch => dispatch({
    type: POST_TEST,
    meta: { args, path, contents },
    payload: postTestFromService({
        args,
        path,
        contents
    })
}).catch(console.error);

export const DELETE_TEST = 'DELETE_TEST';
export const DELETE_TEST_PENDING = 'DELETE_TEST_PENDING';
export const DELETE_TEST_FULFILLED = 'DELETE_TEST_FULFILLED';
export const DELETE_TEST_REJECTED = 'DELETE_TEST_REJECTED';

/**
 * Deletes a specific resource.
 * @param {Object} options 
 * @param {Object} options.args     Arguments passed to test
 * @param {Array} options.path      Path passed to test. For example "['id']" will be converted to rest endpoint "/id", ['search'] will be converted to "/search" and ['search', 'id'] will be converted to "/search/id"
 * @returns {Promise}               Returns a promise which will resolve to action.payload.
 */
export const deleteTest = ({ args = {}, path, path: [id] = [] }) =>  dispatch => dispatch({
    type: DELETE_TEST,
    meta: { args, path },
    payload: deleteTestFromService({
        args,
        path,
    })
}).catch(console.error);

export const CLEAR_TESTS = 'CLEAR_TESTS';

/**
 * Clear all resources from the redux store.
 */
export const clearTest = () => ({ type: CLEAR_TESTS });

