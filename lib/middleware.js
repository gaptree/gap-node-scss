'use strict';

const renderScss = require('./render-scss.js');
const url = require('url');
const path = require('path');

module.exports = (query) => {
    const inputDir = query.inputDir;
    const outputDir = query.outputDir;
    const maxAge = query.maxAge || 0;

    return (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        const reqPath = url.parse(req.url).pathname;
        const scssFile = path.join(inputDir, reqPath).replace(/\.css(\.map)?$/i, '.scss');
        const cssFile = path.join(outputDir, reqPath);
        const render = renderScss(query, scssFile, cssFile);


        if (/\.css$/.test(reqPath)) {
            res.writeHead(200, {
                'Content-Type': 'text/css',
                'Cache-Control': 'max-age=' + maxAge
            });
            res.end(render.css);
        } else if (/\.css\.map$/.test(reqPath)) {
            res.writeHead(200, {
                'Cache-Control': 'max-age=' + maxAge
            });
            res.end(render.map);
        } else {
            return next();
        }
    };
};
