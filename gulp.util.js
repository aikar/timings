/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
var _ = global._ = require('lodash');
var fs = global.fs = require('fs');
var path = global.path = require('path');
var cp = global.cp = require('child_process');
var ini = require('ini');
_.mixin(require("underscore.string").exports());
var merge = require('ordered-merge-stream');
var insert = require('gulp-insert');
var gulp = require('gulp');

module.exports = {
	exec: exec,
	scheduleTask: scheduleTask,
	quote: quote,
	readIni: readIni,
	copyFile: copyFile,
	ini: ini,
	merge: merge,
	wrapJS: wrapJS,
};


// =====================
function wrapJS() {
	return insert.wrap('(function($) {', "\n})(jQuery);");
}
// =====================
var exec = function (arg) {
	var result = require('execSync').exec(arg);
	_.forEach(result.stdout.split("\n"), function (line) {
		line = line.trim();
		if (!line) return;
		gutil.log('[' + arg + '] ' + line);
	});
};

// =====================
var scheduledTasks = {};
function scheduleTask(task, time) {
	if (scheduledTasks[task]) {
		clearTimeout(scheduledTasks[task]);
	}
	scheduledTasks[task] = setTimeout(function () {
		delete scheduledTasks[task];
		gulp.start(task);
	}, time);
}

// =====================
function quote(str) {
	return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}

// =====================
function readIni(file) {
	return ini.parse(fs.readFileSync(file, 'utf-8')) || {};
}

// =====================
function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", done);

	var wr = fs.createWriteStream(target);
	wr.on("error", done);
	wr.on("close", function (ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb && cb(err);
			cbCalled = true;
		}
	}
}
