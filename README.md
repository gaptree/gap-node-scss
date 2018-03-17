# Gap Node SCSS

## Install

```shell
yarn add gap-node-scss
```

## Usage

```javascript
const scss = require('gap-node-scss');

scss.build({
    inputDir: '/path/to/scss/dir',
    outputDir: '/path/to/css/dir',
    includePaths: [
        '/path/to/lib',
        '/path/to/mod'
    ],
    sourceMap: true,
    outputStyle: 'expanded' // nested, expanded, compact, compressed
});
```

```javascript
const express = require('express');
const path = require('path');
const scss = require('gap-node-scss');

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
```

More examples check: <https://github.com/gaptree/gap-node-scss/tree/master/test>
