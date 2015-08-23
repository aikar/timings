'use strict';

var childProcess = require('child_process');
var pathlib = require('path');
var stream = require('stream');
var util = require('util');

var _ = require('lodash');
var Vinyl = require('vinyl');
var gutil = require('gulp-util');


// new Command(commandTemplate, [opts])
// --------------------------------------------------

module.exports = function Command(commandTemplate, opts) {

	// We're on Windows if `process.platform` starts with "win", i.e. "win32".
	var isWindows = (process.platform.lastIndexOf('win') === 0);

	// The cwd and environment of the command are the same as the main node
	// process by default.
	opts = _.defaults(opts||{}, {
		cwd: process.cwd(),
		env: process.env,
		silent: false,
		verbosity: (opts && opts.silent) ? 1 : 2,
		usePowerShell: false
	});

	// Include node_modules/.bin on the path when we execute the command.
	var oldPath = opts.env.PATH;
	opts.env.PATH = pathlib.join(__dirname, '..', '..', '.bin');
	opts.env.PATH += pathlib.delimiter;
	opts.env.PATH += oldPath;


	// Command#exec([stdin], [callback])
	// --------------------------------------------------
	// Execute the command, invoking the callback when the command exits.
	// Returns a Vinyl file wrapping the command's stdout.

	this.exec = function exec(stdin, callback) {

		// Parse the arguments, both are optional.
		// After parsing, stdin is a Vinyl file to use as standard input to
		// the command (possibly empty), and callback is a function.
		if (typeof arguments[0] === 'function') {
			callback = arguments[0];
			stdin = undefined;
		} else if (typeof callback !== 'function') {
			callback = function(){};
		}
		if (!(stdin instanceof Vinyl)) {
			var filename = commandTemplate.split(' ')[0]; // name of command
			var path = pathlib.join(opts.cwd, filename);
			if (typeof stdin === 'string') {
				stdin = new Vinyl({
					path: path,
					contents: new Buffer(stdin)
				});
			} else if (stdin instanceof Buffer
			           || stdin instanceof stream.Readable) {
				stdin = new Vinyl({
					path: path,
					contents: stdin
				});
			} else {
				stdin = new Vinyl(stdin);
				if (!stdin.path) stdin.path = path;
			}
		}

		// Execute the command.
		// We spawn the command in a subshell, so things like I/O redirection
		// just work. e.g. `echo hello world >> ./hello.txt` works as expected.
		var command = _.template(commandTemplate)({file:stdin});
		var subshell;

		// Windows PowerShell
		if (isWindows && opts.usePowerShell) {
			subshell = childProcess.spawn('powershell.exe', [
				'-NonInteractive',
				'-NoLogo',
				'-Command', command
			], {env:opts.env, cwd:opts.cwd});

		// Windows cmd.exe
		} else if (isWindows) {
			subshell = childProcess.spawn('cmd.exe', [
				'/c', command
			], {env:opts.env, cwd:opts.cwd});

		// POSIX shell
		} else {
			subshell = childProcess.spawn('sh', [
				'-c', command
			], {env:opts.env, cwd:opts.cwd});
		}

		// Setup the output.
		// - If verbosity == 3, the command prints directly to the terminal.
		// - If verbosity == 2, the command's stdout and stderr are buffered
		//   and printed to the user's terminal after the command exits (this
		//   prevents overlaping output of multiple commands)
		// - If verbosity == 1, the command's stderr is buffered as in 2, but
		//   the stdout is silenced.
		var logStream = new stream.PassThrough();
		switch (opts.verbosity) {
			case 3:
				logTitle(process.stdout);
				subshell.stdout.pipe(process.stdout);
				subshell.stderr.pipe(process.stderr);
				break;
			case 2:
				subshell.stdout.pipe(logStream);
				// fallthrough
			case 1:
				subshell.stderr.pipe(logStream);
				logTitle(logStream)
				break;
		}
		function logTitle(stream) {
			var title = util.format(
				'$ %s%s',
				gutil.colors.blue(command),
				(opts.verbosity < 2) ? gutil.colors.grey(' # Silenced\n') : '\n'
			);
			stream.write(title);
		}

		// Setup the cleanup proceedure for when the command finishes.
		subshell.once('close', function (code) {
			// Write the buffered output to stdout
			var logContents = logStream.read();
			if (logContents !== null) process.stdout.write(logContents);

			// Report an error if the command exited with a non-zero exit code.
			if (code !== 0) {
				var errmsg = util.format(
					'Command `%s` exited with code %s',
					command,
					code
				);
				var err = new Error(errmsg);
				err.status = code;
				return callback(err);
			}

			callback(null);
		});

		// The file wrapping stdout is as the one wrapping stdin (same metadata)
		// with different contents.
		// TODO: use Vinyl#clone
		var stdout = stdin.clone();
		stdout.contents = subshell.stdout.pipe(new stream.PassThrough());

		// Finally, write the input to the process's stdin.
		stdin.pipe(subshell.stdin);
		return stdout;
	};


	// Command#toString()
	// --------------------------------------------------
	// Returns the command template

	this.toString = function toString() {
		return commandTemplate;
	};

};
