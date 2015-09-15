var gulp = require('gulp');
require('../')(gulp);

gulp.task('x', function() {
    console.log('x-task');
});

gulp.task('y', function() {
    console.log('y-task');
});

gulp.task('_hidden_by_default', function() {
    console.log('hidden');
});