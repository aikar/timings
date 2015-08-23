CSSWring
========

Minify CSS file with source maps. That's only.

Written with [PostCSS][1].


SYNOPSIS
--------

For readability, almost all CSS file contains a lot of white spaces, extra
semicolon, etc.:

    .foo {
      color: black;
    }
    
    .bar {
      margin-bottom: 0;
      margin-left: auto;
      margin-right: auto;
      margin-top: 0;
    }

This PostCSS plugin removes these non-essential parts of CSS file, like this:

    .foo{color:black}.bar{margin:0 auto}


INSTALL
-------

    $ npm install csswring


USAGE
-----

    #!/usr/bin/env node
    
    'use strict';
    
    var fs = require('fs');
    var csswring = require('csswring');
    
    var css = fs.readFileSync('test.css', 'utf8');
    fs.writeFileSync('test.min.css', csswring.wring(css).css);


### As PostCSS Plugin

    'use strict';
    
    var fs = require('fs');
    var postcss = require('postcss');
    
    var css = fs.readFileSync('test.css', 'utf8');
    fs.writeFileSync('test.min.css', postcss([
      require('autoprefixer-core'),
      require('csswring');
    ]).css);


## As CLI Program

This package also installs a command line interface.

    $ node ./node_modules/.bin/csswring --help
    Usage: csswring [options] INPUT [OUTPUT]
    
    Description:
      Minify CSS file with source maps. That's only.
    
    Options:
          --sourcemap            Create source map file.
          --preserve-hacks       Preserve some CSS hacks.
          --remove-all-comments  Remove all comments.
      -h, --help                 Show this message.
      -v, --version              Print version information.
    
    Use a single dash for INPUT to read CSS from standard input.

When PostCSS failed to parse INPUT, CLI shows a CSS parse error in GNU error
format instead of Node.js stack trace.


### As Grunt Plugin

This package also installs a Grunt plugin. You can enable this plugin in
`Gruntfile.js` of your project like that:

    grunt.loadNpmTasks('csswring');

To minify `src/css/**/*.css` to `build/css/**/*.min.css` with source map:

    grunt.initConfig({
      csswring: {
        options: {
          map: true
        },
    
        main: {
          cwd: 'src/css/',
          dest: 'build/css/',
          expand: true,
          ext: 'min.css',
          src: [
            '**/*.css'
          ]
        }
      }
    });

The `options` is completely same as [this package options][8].

This was not tested. I suggest using [`grunt-postcss`][7].


MINIFICATIONS
-------------

CSSWring doesn't remove only white spaces or comments, but also remove an
unnecessary parts of CSS. See [minification details][2] in our GitHub Wiki.


OPTIONS
-------

### preserveHacks

By default, CSSWring removes all unknown portion of CSS declaration that
includes some CSS hacks (e.g., underscore hacks and star hacks). If you want to
preserve these hacks, pass `preserveHacks: true` to this module.

    csswring({
      preserveHacks: true
    }).wring(css);


### removeAllComments

By default, CSSWring keeps a comment that start with `/*!`. If you want to
remove all comments, pass `removeAllComments: true` to this module.

    csswring({
      removeAllComments: true
    }).wring(css);


API
---

### wring(css, [options])

Wring `css` with specified `options`.

The second argument is optional. The `options` is same as the second argument of
PostCSS's `process()` method. This is useful for generating source map.

    var fs = require('fs');
    var csswring = require('csswring');
    
    var css = fs.readFileSync('from.css', 'utf8');
    var result = csswring.wring(css, {
      map: {
        inline: false
      },
      from: 'from.css',
      to: 'to.css'
    });
    fs.writeFileSync('to.css', result.css);
    fs.writeFileSync('to.css.map', result.map);

See also [Source Map section][3] in PostCSS document for more about this
`options`.

You can also merge CSSWring options mentioned above to the second argument:

    var result = csswring.wring(css, {
      map: true,
      preserveHacks: true
    });


### postcss

Returns a [PostCSS processor][4].

You can use this property for combining with other PostCSS processors/plugins
such as [Autoprefixer][5] or [postcss-url][6].

    var fs = require('fs');
    var postcss = require('postcss');
    var autoprefixer = require('autoprefixer');
    var csswring = require('csswring');
    
    var css = fs.readFileSync('test.css', 'utf8');
    postcss().use(
      autoprefixer.postcss
    ).use(
      csswring.postcss
    ).process(css);


LICENSE
-------

MIT: http://hail2u.mit-license.org/2014


[1]: https://github.com/postcss/postcss
[2]: https://github.com/hail2u/node-csswring/wiki
[3]: https://github.com/postcss/postcss#source-map-1
[4]: https://github.com/postcss/postcss#processor
[5]: https://github.com/postcss/autoprefixer-core
[6]: https://github.com/postcss/postcss-url
[7]: https://github.com/nDmitry/grunt-postcss
[8]: #options
