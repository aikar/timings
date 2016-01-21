var assert = require("assert");
var dart = require("./");
var vinylFile = require("vinyl-file");

it("should generate js code with dart2js comment banner", function(cb) {
  this.timeout(10000);

  var stream = dart();

  stream.on("data", function(file) {
    assert(/dart2js/.test(file.contents.toString()));
    cb();
  });

  stream.write(vinylFile.readSync("./test-files/foo.dart"));
});
