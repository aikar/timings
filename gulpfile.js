/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
"use strict";
const gulp = require('gulp');
const runSeq = require('run-sequence').use(gulp);
require('gulp-bash-completion')(gulp);
const $ = require('gulp-load-plugins')();
const $u = require('./gulp.util');

const autoprefixer = require('autoprefixer');
const postcssurl = require("postcss-url");
const postcss = require('gulp-postcss');
const csswring = require('csswring');
const mqpacker = require('css-mqpacker');
const bless = require('gulp-bless');
const shell = require("gulp-shell");
const webpack = require('webpack');
const dir = __dirname;
const paths = {};
const gutil = require("gulp-util");




paths.static = `${dir}/static`;
paths.js = [`${paths.static}/js/**.js`,`${paths.static}/js/**.jsx`];
paths.dist = `${paths.static}/dist`;


gulp.task('css', () => {
	const processors = [
		autoprefixer({browsers: ['last 2 versions', 'IE 9', 'IE 10']}),
		postcssurl({url: "rebase"}),
		mqpacker,
		csswring({preserveHacks: true})
	];

	return gulp.src(paths.css_entryfile)
		.pipe($.sass({
			outputStyle: 'nested',
			errLogToConsole: true
		}))
		.pipe(postcss(processors, {
			to: `${paths.dist}/timings.css`
		}))
		.pipe($.concat('timings.css'))
		.pipe(bless())
		.pipe(gulp.dest(paths.dist));
});

// EXAMPLE: https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js

const webpackConfig = require('./webpack.config');

gulp.task('build', (cb) => {
	let config = webpackConfig(false);
	webpack(config, config.reporter(cb));
});

gulp.task('build:release', (cb) => {
	// modify some webpack config options
	let config = webpackConfig(true);
	webpack(config, config.reporter(cb));
});


gulp.task('default', () => {
	process.env.NODE_ENV = process.env.NODE_ENV || "development";
	let config = webpackConfig(process.env.NODE_ENV === "production", true);
	webpack(config, config.reporter());
});
