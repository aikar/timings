# gulp-dart

[![NPM version][npm-image]][npm-url]
[![Dependency Status][depstat-image]][depstat-url]

> Compile Dart to JavaScript using [dart2js](https://www.dartlang.org/tools/dart2js/)

## Preinstall

You need install `dartsdk` at first. Go to [https://www.dartlang.org/downloads/](https://www.dartlang.org/downloads/) for more information.

If you already have it installed and got ENOENT error then read [this thread](https://github.com/agudulin/gulp-dart/issues/6).

## Install

```sh
$ npm install --save gulp-dart
```


## Usage

```js
var gulp = require("gulp");
var dart = require("gulp-dart");

gulp.task("default", function() {
  return gulp
    .src('web/*.dart')
    .pipe(dart({
      "dest": "./dist",
      "minify": "true"
    }))
    .pipe(gulp.dest('./'))
});
```

## Supported dart2js options
```js
checked                  // Insert runtime type checks and enable assertions (checked mode)
minify                   // Generate minified output
verbose                  // Display verbose information
analyze-all              // Analyze all code
analyze-only             // Analyze but do not generate code
analyze-signatures-only  // Skip analysis of method bodies and field initializers
suppress-warnings        // Do not display any warnings
fatal-warnings           // Treat warnings as compilation errors
suppress-hints           // Do not display any hints
enable-diagnostic-colors // Add colors to diagnostic messages
no-source-maps           // Do not generate a source map file
terse                    // Emit diagnostics without suggestions for how to get rid of the diagnosed problems
csp                      // Disables dynamic generation of code in the generated output
preserve-uris            // Preserve the source URIs in the reflection data
show-package-warnings    // Show warnings and hints generated from packages
```

## License

MIT © [Alexander Gudulin](http://gudulin.com)

[npm-url]: https://npmjs.org/package/gulp-dart
[npm-image]: https://img.shields.io/npm/v/gulp-dart.svg?style=flat-square

[depstat-url]: https://david-dm.org/agudulin/gulp-dart
[depstat-image]: https://david-dm.org/agudulin/gulp-dart.svg?style=flat-square
