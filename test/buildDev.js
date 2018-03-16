'use strict';

const path = require('path');

const scss = require('../index.js');

scss.build({
    inputDir: path.resolve(__dirname, 'src/scss'),
    outputDir: path.resolve(__dirname, 'dev/css'),
    includePaths: [
        path.resolve(__dirname, 'module/scss/normalize-scss/')
    ],
    sourceMap: true,
    outputStyle: 'expanded' // nested, expanded, compact, compressed
});
