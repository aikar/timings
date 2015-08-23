gulp-bless [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]
==========

Gulp plugin which splits CSS files suitably for Internet Explorer &lt; 10.

This is the a [Gulp](http://github.com/gulpjs/gulp) wrapper around [bless.js](https://github.com/paulyoung/bless.js) (see [blesscss.com](http://blesscss.com/)).

# Information
<table>
<tr>
<td>Package</td><td>gulp-bless</td>
</tr>
<tr>
<td>Description</td>
<td>CSS post-processor which splits CSS files suitably for Internet Explorer &lt; 10. Bless + Gulp = gulp-bless.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.9</td>
</tr>
</table>

# Installation
```js
npm install gulp-bless
```

# Usage
```js
var gulp = require('gulp');
var bless = require('gulp-bless');

gulp.task('css', function() {
    gulp.src('style.css')
        .pipe(bless())
        .pipe(gulp.dest('./splitCSS'));
});

gulp.task('default', ['watch']);

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('./css/*.css', ['css']);
});
```

**bless(options)**. The (optional) `options` argument is passed on to [bless.js](https://github.com/paulyoung/bless.js). You can also include a `log` option to control whether Gulp should log output which defaults to `false` (this isn't passed to `bless.js`).

Bless' options are listed here: [paulyoung/bless.js/blob/master/bin/blessc#L10](https://github.com/paulyoung/bless.js/blob/master/bin/blessc#L10).
For example, if you didn't want the first CSS chunk / "blessed" file to `@import` the others, then you'd do this:


```javascript
gulp.src('long.css')
        .pipe(bless({
            imports: false
        }))
        .pipe(gulp.dest('./'))
```

Note: Breaking change as of `3.0.0`; the `options` did not fallback to the [bless.js' defaults](https://github.com/paulyoung/bless.js/blob/master/bin/blessc#L10) when missing, but do now.

##### A note about sourcemaps:
If you're using a CSS pre-processor which creates inline sourcemaps [bless.js](https://github.com/paulyoung/bless.js) will take a very long time to run. It's recommended that you don't pass files containing inline sourcemaps to `gulp-bless`. If you do want to use sourcemaps then create them as a separate `.map` file.

If you can't create separate sourcemap files — such as if you are using ~v0.7 of [gulp-sass](https://www.npmjs.org/package/gulp-sass) which uses `libsass` — consider creating a minified version of your CSS (using something like [gulp-minify-css](https://www.npmjs.org/package/gulp-minify-css)) which strips out the inline sourcemap and running `gulp-bless` on that, then include that file in production whilst still including your development version with its inline sourcemap when developing locally.

## Warning: gulp-bless has changed a lot since 1.0.0
- It no longer concatenates all files that come down the pipeline.
- fileName can no longer be passed directly to the plugin itself.



[npm-url]: https://npmjs.org/package/gulp-bless
[npm-image]: https://badge.fury.io/js/gulp-bless.png

[travis-url]: http://travis-ci.org/adam-lynch/gulp-bless
[travis-image]: http://img.shields.io/travis/adam-lynch/gulp-bless.svg?style=flat

[depstat-url]: https://david-dm.org/adam-lynch/gulp-bless
[depstat-image]: https://david-dm.org/adam-lynch/gulp-bless.png
