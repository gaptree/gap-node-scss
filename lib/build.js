'use strict';

const glob = require('glob');
const path = require('path');
const renderScss = require('./render-scss.js');
const print = require('./print.js');
const mkdirp = require('mkdirp');
const fs = require('fs');

module.exports = (query) => {
    const inputDir = query.inputDir;
    const outputDir = query.outputDir;
    const follow = (query.follow === true) ? true : false;

    glob(
        path.resolve(inputDir, '**/*.{sass,scss}'),
        {ignore: '**/_*', follow: follow},
        function (err, files) {
            if (err) {
                print.error(err);
            }

            if (files.length <= 0) {
                print.error(`No scss file was found in ${inputDir}`);
            }

            files.forEach(scssFile => {
                const cssFile = path.join(outputDir, scssFile.substr(inputDir.length))
                    .replace(/.scss$/i, '.css');
                const render = renderScss(query, scssFile, cssFile);

                mkdirp.sync(path.dirname(cssFile));
                fs.writeFileSync(cssFile, render.css.toString());
                print.info(`Save css: ${cssFile}`);

                if (query.sourceMap === true) {
                    const mapFile = cssFile + '.map';
                    fs.writeFileSync(mapFile, render.map.toString());
                    print.info(`Save source map: ${mapFile}`);
                }
            });
        }
    );
};
