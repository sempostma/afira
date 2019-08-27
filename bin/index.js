#!/usr/bin/env node

try {
    require('../index');
} catch(err) {
    console.error(err);
    process.exit(1);
}