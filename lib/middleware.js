'use strict';

const nodeSass = require('node-sass');
const url = require('url');
const path = require('path');

module.exports.middleware = (opts) => {
    const inputDir = opts.inputDir;
    const outputDir = opts.outputDir;
    const includePaths = opts.includePaths || [];
    const outputStyle = opts.outputStyle || 'nested';
    const sourceMap = opts.sourceMap;
    const maxAge = opts.maxAge || 0;

    function getSassRes(reqPath) {
        const scssFile = path.join(inputDir, reqPath).replace(/\.css(\.map)?$/i, '.scss');
        const cssFile = path.join(outputDir, reqPath);
    
        const sassOptions = {
            file: scssFile,
            outFile: cssFile,
            outputStyle: outputStyle,
            includePaths: includePaths
        };

        if (sourceMap) {
            sassOptions.sourceMap = true;
            sassOptions.sourceMapContents = true;
        } else {
            sassOptions.omitSourceMapUrl = true;
        }

        return nodeSass.renderSync(sassOptions);
    }

    function renderCss(reqPath) {
        return getSassRes(reqPath).css;
    }

    function renderSourceMap(reqPath) {
        return getSassRes(reqPath).map;
    }

    return (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        let reqPath = url.parse(req.url).pathname;
        let render;

        if (/\.css$/.test(reqPath)) {
            render = renderCss(reqPath);
            res.writeHead(200, {
                'Content-Type': 'text/css',
                'Cache-Control': 'max-age=' + maxAge
            });
        } else if (/\.css\.map$/.test(reqPath)) {
            render = renderSourceMap(reqPath);
            res.writeHead(200, {
                'Cache-Control': 'max-age=' + maxAge
            });
        } else {
            return next();
        }

        res.end(render);
    };
};
