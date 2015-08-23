var gulp = require('gulp');
var mocha = require('gulp-mocha');
var coverage = require('gulp-coverage');

gulp.task('default', ['test']);

gulp.task('test', function(){
    gulp.src('test/main.js')
        .pipe(coverage.instrument({
            pattern: ['index.js'],
            debugDirectory: 'debug'
        }))
        .pipe(mocha({
            reporter: 'spec'
        }))
        /*
        // uncomment and comment out other coverage.* pipes to get coverage HTML report
        .pipe(coverage.report({
            outFile: 'coverage.html'
        }))*/
        .pipe(coverage.gather())
        .pipe(coverage.enforce({
            statements: 85,
            lines: 85,
            blocks: 75
        }));
});