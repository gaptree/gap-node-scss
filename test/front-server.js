'use strict';

const express = require('express');
const path = require('path');
const scss = require('../index.js');

const app = express();
const port = '8007';
const publicSlug = 'css';

app.use('/' + publicSlug, scss.middleware({
    inputDir: path.resolve(__dirname, 'src/scss'),
    outputDir: path.resolve(__dirname, 'dev/css'),
    includePaths: [
        path.resolve(__dirname, 'module/scss/normalize-scss/')
    ],
    sourceMap: true,
    outputStyle: 'expanded' // nested, expanded, compact, compressed
}));

app.listen(port, function () {
    console.log('Front server listening on port ' + port + '!');
});
