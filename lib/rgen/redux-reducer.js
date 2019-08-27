const camelCase = require('camelcase');
var path = require('path');
var fs = require('fs');
const util = require('./util');

module.exports = async ({ dir, name, idPath }) => {
    const modules = util.getModules();

    const pascal = camelCase(name, {pascalCase: true});
    const camel = camelCase(name);
    const upCase = name.toUpperCase();
    const lower = name.toLowerCase();

    fs.writeFileSync(path.join(dir, `${lower}.js`),
    `import get from 'lodash/get';

import {
    FETCH_${upCase}S_FULFILLED,
    FETCH_${upCase}S_PENDING,
    FETCH_${upCase}S_REJECTED,

    PUT_${upCase}_FULFILLED,
    PUT_${upCase}_PENDING,
    PUT_${upCase}_REJECTED,

    POST_${upCase}_FULFILLED,
    POST_${upCase}_PENDING,
    POST_${upCase}_REJECTED,

    DELETE_${upCase}_FULFILLED,
    DELETE_${upCase}_PENDING,
    DELETE_${upCase}_REJECTED,

    CLEAR_${upCase}
} from '<path to action creator>';

const idSelector = '${idPath}';

const initialState = {
    map: {},
    categorized: {},
    isLoading: false,
    error: null,
}

export default (state = initialState, action) => {
    const { meta: { args, path, contents }, payload } = action;
    switch (action.type) {
        case FETCH_${upCase}S_PENDING: {
            return Object.assign({}, {
                isLoading: true
            });
        }

        case FETCH_${upCase}S_FULFILLED: {
            const result = payload;

            if (!result) return state;

            const argKeys = Object.keys(args);

            let map = state.map;
            let categorized = state.categorized;

            // Loop through results and store them in redux state.
            const mapped = Object.assign({},
                ...(Array.isArray(result)
                    ? result.map(x => ({ [get(x, idSelector)]: x }))
                    : { [get(result, idSelector)]: result })
            )

            map = Object.assign({}, map, mapped);

            argKeys.forEach(key => {
                if (!(key in categorized)) categorized[key] = {};
                Object.assign(categorized[key], mapped);
            });

            return Object.assign({}, {
                isLoading: false,
                error: null,
                map,
                categorized
            });
        }

        case FETCH_${upCase}S_REJECTED: {
            return Object.assign({}, {
                isLoading: false,
                error: payload
            });
        }

        case PUT_${upCase}_PENDING: {
            return Object.assign({}, {
                isLoading: true,
            });
        }

        case PUT_${upCase}_REJECTED: {
            return Object.assign({}, {
                isLoading: false,
                error: payload,
            });
        }

        case PUT_${upCase}_FULFILLED: {
            const id = get(payload, idSelector, get(contents, idSelector));

            if (!(id in state.map)) {
                console.warn(\`No ${camel} to update in store with id: \${id}\`);
                return;
            }

            const value = Object.assign({}, state.map[id], contents || {}, payload || {});

            const categorized = Object.assign({}, state.categorized);
            const map = Object.assign({}, state.map, { [id]: value });

            const argKeys = Object.keys(args);

            argKeys.forEach(key => {
                if (!(key in categorized)) categorized[key] = {};
                Object.assign(categorized[key], { [id]: value });
            });

            return Object.assign({}, {
                isLoading: false,
                error: null,
                map,
                categorized
            });
        }

        case POST_${upCase}_PENDING: {
            return Object.assign({}, {
                isLoading: true,
                error: null,
            });   
        }

        case POST_${upCase}_REJECTED: {
            return Object.assign({}, {
                isLoading: false,
                error: payload,
            });   
        }

        case POST_${upCase}_FULFILLED: {
            const id = get(payload, idSelector, get(contents, idSelector));

            if (!(id in state.map)) {
                console.warn(\`No ${camel} to create in store with id: \${id}\`);
                return;
            }

            const map = Object.assign({}, state.map);
            const categorized = Object.assign({}, state.categorized);

            delete map[id];

            const argKeys = Object.keys(args);

            argKeys.forEach(key => {
                if (key in categorized) delete categorized[key];
            });

            return Object.assign({}, {
                isLoading: false,
                error: null,
                map,
                categorized
            });
        }

        case DELETE_${upCase}_PENDING: {
            return Object.assign({}, {
                isLoading: true,
                error: null,
            });
        }

        case DELETE_${upCase}_REJECTED: {
            return Object.assign({}, {
                isLoading: false,
                error: null,
            });
        }

        case DELETE_${upCase}_FULFILLED: {
            const id = get(payload, idSelector, get(contents, idSelector));

            if (!(id in state.map)) {
                console.warn(\`No ${camel} to delete in store with id: \${id}\`);
                return;
            }

            const value = Object.assign({}, state.map[id], contents || {}, payload || {});
            const item = Object.assign({}, state.map[id], value);
            const categorized = Object.assign({}, state.categorized);
            const map = Object.assign(state.map, { [id]: item });
            const argKeys = Object.keys(args);

            argKeys.forEach(key => {
                if (!(key in categorized)) categorized[key] = {};
                Object.assign(categorized[key], { [id]:item });
            });

            return Object.assign({}, {
                isLoading: false,
                error: null,
                map,
                categorized
            });
        }

        case CLEAR_${upCase}S: {
            return Object.assign({}, {
                isLoading: false,
                error: null,
                map: {},
                categorized: {}
            });
        }

        default: {
            return state;
        }
    }
}
`, { flag: "wx" });

}





