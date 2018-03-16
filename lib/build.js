'use strict';

const glob = require('glob');
const path = require('path');
const nodeSass = require('node-sass');
const print = require('./print.js');
const mkdirp = require('mkdirp');
const fs = require('fs');

module.exports.build = (opts) => {
    const inputDir = opts.inputDir;
    const outputDir = opts.outputDir;
    const includePaths = opts.includePaths || [];
    const sourceMap = opts.sourceMap;
    const follow = (opts.follow === true) ? true : false;
    const outputStyle = opts.outputStyle || 'nested';

    function getSassOptions(scssFile, cssFile) {
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

        return sassOptions;
    }

    function saveCss(scssFile) {
        let cssFile = path.join(outputDir,  scssFile.substr(inputDir.length));
        cssFile = cssFile.replace(/.scss$/i, '.css');
        const mapFile = cssFile + '.map';

        const res = nodeSass.renderSync(getSassOptions(scssFile, cssFile));

        mkdirp.sync(path.dirname(cssFile));
        fs.writeFileSync(cssFile, res.css.toString());
        print.info(`Save css: ${cssFile}`);

        if (sourceMap) {
            fs.writeFileSync(mapFile, res.map.toString());
            print.info(`Save source map: ${mapFile}`);
        }
    }

    glob(
        path.resolve(inputDir, '**/*.{sass,scss}'),
        {ignore: '**/_*', follow: follow},
        function (err, files) {
            if (err) {
                print.error(err);
                //console.error(err);
            }

            if (files.length <= 0) {
                print.error(`No scss file was found in ${inputDir}`);
            }

            files.forEach(scssFile => {
                saveCss(scssFile);
            });
        }
    );
};
