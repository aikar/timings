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
paths.vendorjs = [`${dir}/vendor/js/**.js`];
paths.js = [`${paths.static}/js/**.js`,`${paths.static}/js/**.jsx`];
// Files to watch for CSS change, but we have a single entry point
paths.css_watch = [`${paths.static}/css/**.scss`];
paths.css_entryfile = `${paths.static}/css/timings.scss`;
paths.dist = `${paths.static}/dist`;

gulp.task('vendor', () => {
	return gulp.src(paths.vendorjs)
		 .pipe($.uglify({mangle: false}))
		 .pipe($.concat('vendor.js'))
		 .pipe(gulp.dest(paths.dist))
		;
});

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
const webpackDevConfig = Object.create(webpackConfig);
// modify some webpack config options
webpackDevConfig.devtool = "cheap-module-eval-source-map";
webpackDevConfig.debug = true;
webpackDevConfig.output.pathinfo = true;
webpackDevConfig.module.loaders.forEach((m) => {
	if (m.loader == 'babel') {
		m.query.cacheDirectory = '.babel-cache';
	}
});

const webpackDev = webpack(webpackDevConfig);

gulp.task('webpack:dev', (cb) => {
	return webpackDev.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		cb();
	});
});

gulp.task('webpack:build', (cb) => {
	// modify some webpack config options
	const prodConfig = Object.create(webpackConfig);
	prodConfig.devtool = 'hidden-source-map';
	prodConfig.plugins = prodConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);
	webpack(prodConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		cb();
	});
});

gulp.task('build-release', ['vendor', 'css'], function(cb) {
	runSeq(['webpack:build'], cb);
});


gulp.task('default', ['vendor', 'css'], () => {
	runSeq(['webpack:dev']);
	$.watch(paths.js,  () => $u.scheduleTask('webpack:dev', 1500));
	$.watch(paths.css_watch, () => $u.scheduleTask('css', 1500));
	setImmediate(() => {
		$.util.log('================================================================');
		$.util.log('===================== NOW MONITORING FILES =====================');
		$.util.log('================== PRESS CONTROL + C TO ABORT ==================');
		$.util.log('================================================================');
	});
});
