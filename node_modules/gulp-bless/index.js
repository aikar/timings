'use strict';

var through = require('through2');
var path = require('path');
var bless = require('bless');
var gutil = require('gulp-util');
var merge = require('merge');
var File = gutil.File;
var PluginError = gutil.PluginError;

module.exports = function(options){
    var pluginName = 'gulp-bless';
    var defaults = {
        cacheBuster: true,
        cleanup: true,
        compress: false,
        force: false,
        imports: true
    };

    options = merge(true, defaults, options);

    return through.obj(function(file, enc, cb) {
        if (file.isNull()) return cb(null, file); // ignore
        if (file.isStream()) return cb(new PluginError(pluginName,  'Streaming not supported'));

        var stream = this;

        if (file.contents && file.contents.toString()) {
            var fileName = path.basename(file.path);
            var outputFilePath = path.resolve(path.dirname(file.path), fileName);
            var contents = file.contents.toString('utf8');
            var blessOpts = merge(true, options);
            if(typeof blessOpts.log !== 'undefined') delete blessOpts.log

            new (bless.Parser)({
                output: outputFilePath,
                options: blessOpts
            }).parse(contents, function(err, blessedFiles, numSelectors) {
                    if (err) {
                        return cb(new PluginError(pluginName,  err));
                    }

                    if (options.log) {
                        // print log message
                        var msg = 'Found ' + numSelectors + ' selector' + (numSelectors === 1 ? '' : 's') + ', ';
                        if (blessedFiles.length > 1) {
                            msg += 'splitting into ' + blessedFiles.length + ' blessedFiles.';
                        } else {
                            msg += 'not splitting.';
                        }
                        gutil.log(msg);
                    }

                    // write processed file(s)
                    blessedFiles.forEach(function (blessedFile) {
                        stream.push(new File({
                            cwd: file.cwd,
                            base: file.base,
                            path: path.resolve(blessedFile.filename),
                            contents: new Buffer(blessedFile.content)
                        }));
                    });

                    cb();
                });
        } else {
            return cb(null, file);
        }
    });
};
