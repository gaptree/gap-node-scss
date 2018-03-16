'use strict';

const chalk = require('chalk');

module.exports = {
    error: (msg) => {
        console.error(chalk.red(msg));
        process.exit(1);
    },
    info: (msg) => {
        console.log(msg);
    },
    warn: (msg) => {
        console.log(chalk.yellow(msg));
    }
};
