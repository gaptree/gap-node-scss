'use strict';

const path = require('path');

const scss = require('../index.js');

scss.build({
    inputDir: path.resolve(__dirname, 'src/scss'),
    outputDir: path.resolve(__dirname, 'dist/css'),
    includePaths: [
        path.resolve(__dirname, 'module/scss/normalize-scss/')
    ],
    outputStyle: 'compressed' // nested, expanded, compact, compressed
});
