'use strict';

const meow = require('meow');
const path = require('path');
const glob = require('glob');
const util = require('util');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const sass = require('node-sass');
const fs = require('fs');

const asyncForEach = require('async-foreach').forEach;

function printErr() {
    let message = util.format.apply(this, arguments);
    console.error(chalk.red(message));
    process.exit(1);
}

function printWarn() {
    let message = util.format.apply(this, arguments);
    console.warn(chalk.yellow(message));
}

function printInfo() {
    let message = util.format.apply(this, arguments);
    console.warn(chalk.green(message));
}

function gapRenderFile(file, outFile, options) {
    let renderOptions = {
        file: file,
        outFile: outFile,
        includePaths: options.includePaths,
        outputStyle: options.outputStyle
    };


    if (options.sourceMap) {
        renderOptions.sourceMap = true;
        renderOptions.sourceMapContents = true;
    } else {
        renderOptions.omitSourceMapUrl = true;
    }

    sass.render(renderOptions, function (err, result) {
        if (err) {
            return sassRenderErr(err);
        }

        return sassRenderSuccess(result, outFile, renderOptions.sourceMap);
    });
}

function sassRenderErr(err) {
    printErr(err);
}

function sassRenderSuccess(result, outFile, isSourceMap = false) {
    //printInfo('Rending complete, saving .css file ...');
    mkdirp(path.dirname(outFile), function (err) {
        if (err) {
            printErr(err);
        }

        fs.writeFile(outFile, result.css.toString(), function (err) {
            if (err) {
                printErr(err);
            }
            printInfo('Wrote CSS to ' + outFile);
        });

        if (isSourceMap) {
            let sourceMapFile = outFile + '.map';

            fs.writeFile(sourceMapFile, result.map, function (err) {
                if (err) {
                    return printErr(err);
                }

                printInfo('Wrote source map to ' + sourceMapFile);
            });
        }
    });
}

module.exports =  (inputOptions) => {
    /*
     * default: {
     *     'outputStyle': 'nested',
     *     'sourceMap': true,
     *     'outputDir': 'dist/css',
     *     'inputDir': 'scss',
     *     'follow': true
     * }
     */

    let options = {
        outputStyle: inputOptions.outputStyle || 'nested',
        outputDir: inputOptions.outputDir || 'dist/css',
        inputDir: inputOptions.inputDir || 'scss',
        includePaths: inputOptions.includePaths || [],
        baseDir: inputOptions.baseDir || process.cwd()
    };

    if (!inputOptions.hasOwnProperty('sourceMap')) {
        options.sourceMap = true;
    } else {
        options.sourceMap = (inputOptions.sourceMap !== false);
    }

    let baseDir = options.baseDir;
    let inputRealDir = path.resolve(baseDir, options.inputDir);
    let outputRealDir = path.resolve(baseDir, options.outputDir);
    let globPath = path.resolve(inputRealDir, '**/*.{sass,scss}');

    glob(
        globPath,
        {ignore: '**/_*', follow: options.follow},
        function (err, files) {
            if (err) {
                console.error(err);
                // process.exit(1);
            }
            if (files.length <= 0) {
                printErr('No scss file was found in %s.', path.join(baseDir, options.inputDir));
            }

            asyncForEach(
                files,
                function (file) {
                    let outFile = path.join(outputRealDir, file.substr(inputRealDir.length));
                    outFile = outFile.replace('.scss', '.css');
                    // todo use preg replace instead

                    gapRenderFile(file, outFile, options);
                },
                function (success, arr) {
                    let outputDir = path.join(baseDir, options.outputDir);
                    printWarn('Wrote %s CSS files into %s', arr.length, outputDir);
                }
            );
        }
    );
};
