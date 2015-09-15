// gulp-run
// ==================================================
// Pipe shell commands in gulp.

'use strict';

console.log('Warning: gulp-run is deprecated');

var Transform = require('stream').Transform;

var Command = require('./lib/command');


// run(template, [opts])
// new GulpRunner(template, [opts])
// --------------------------------------------------
// Creates a GulpRunner.
//
// A GulpRunner is a Vinyl transform stream that spawns a child process to
// transform the file. A separate process is spawned to handle each file
// passing through the stream.

var GulpRunner = module.exports = function run(template, opts) {
	if (!(this instanceof GulpRunner)) {
		return new GulpRunner(template, opts);
	}

	var command = new Command(template, opts);

	Transform.call(this, {objectMode:true});

	this._transform = function _transform(file, enc, callback) {
		var newfile = command.exec(file, callback);
		this.push(newfile);
	};


	// GulpRunner#exec([stdin], [callback])
	// --------------------------------------------------
	// Writes `stdin` to itself and returns itself.
	//
	// Whenever an object is written into the GulpRunner, a new process is
	// spawned taking that data as standard input, and a Vinyl file wrapping the
	// process's standard output is pushed downstream.
	//
	// `stdin` may be a String, Buffer, Readable stream, or Vinyl file.

	this.exec = function (stdin, callback) {
		this.write(stdin, callback);
		this.end();
		return this;
	};

};

GulpRunner.prototype = Transform.prototype;

GulpRunner.Command = Command;
