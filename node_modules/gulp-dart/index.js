var gutil = require("gulp-util");
var objectAssign = require("object-assign");
var spawn = require("child_process").spawn;
var through = require("through2");
var path = require("path");
var vinylFile = require("vinyl-file");

function prefixOptions(options) {
  return Object.keys(options).filter(function(key) {
    return options[key];
  }).map(function(key) {
    return "--" + key;
  });
}

var plugin = function(options) {
  options = objectAssign({
    "dest": null,
    "checked": false,
    "minify": false,
    "verbose": false,
    "analyze-all": false,
    "analyze-only": false,
    "analyze-signatures-only": false,
    "suppress-warnings": false,
    "fatal-warnings": false,
    "suppress-hints": false,
    "enable-diagnostic-colors": false,
    "no-source-maps": false,
    "terse": false,
    "csp": false,
    "preserve-uris": false,
    "show-package-warnings": false
  }, options);

  var dest = options.dest;
  // remove the dest option because we want to pass this object to dart2js as arguments
  delete options.dest;

  return through.obj(function(file, encoding, done) {
    var args = prefixOptions(options);
    var destDir = dest || path.dirname(file.path);
    var destFile = path.join(destDir, path.basename(file.path) + ".js");

    args.unshift(file.path);
    args.push("-o", destFile);

    var child = spawn("dart2js", args);

    child.stdout.on("data", function(data) {
      gutil.log("gulp-dart:", data.toString("utf-8"));
    });
    child.stderr.on("data", function(data) {
      gutil.log("gulp-dart:", data.toString("utf-8"));
    });
    child.on("exit", function(code) {
      gutil.log("gulp-dart:", code);
      done(null, vinylFile.readSync(destFile));
    });

  });
};

module.exports = plugin;
