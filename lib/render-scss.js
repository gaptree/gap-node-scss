'use strict';

const nodeSass = require('node-sass');

module.exports = (query, scssFile, cssFile) => {
    const opts = {
        file: scssFile,
        outFile: cssFile,
        outputStyle: query.outputStyle || 'nested', // compressed, nested, expanded, compact, compressed
    };

    if (query.includePaths) {
        opts.includePaths = query.includePaths;
    }

    if (query.sourceMap) {
        opts.sourceMap = true;
        opts.sourceMapContents = true;
    } else {
        opts.omitSourceMapUrl = true;
    }

    return nodeSass.renderSync(opts);
};
