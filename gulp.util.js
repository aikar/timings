/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
const fs = require('fs');
const path = require('path');
const ini = require('ini');
const merge = require('ordered-merge-stream');
const gulp = require('gulp');
const gutil = require('gulp-util');
const cp = require("child_process");


// =====================
function exec(arg) {
  const result = cp.execSync(arg).toString();
  result.split("\n").forEach(function (line) {
    line = line.trim();
    if (!line) return;
    gutil.log('[' + arg + '] ' + line);
  });
}
module.exports = {
  exec: exec,
  scheduleTask: scheduleTask,
  quote: quote,
  readIni: readIni,
  copyFile: copyFile,
  ini: ini,
  merge: merge,
};

// =====================
const scheduledTasks = {};
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
  let cbCalled = false;

  const rd = fs.createReadStream(source);
  rd.on("error", done);

  const wr = fs.createWriteStream(target);
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
