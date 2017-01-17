/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */
let webpack = require('webpack');
let path = require('path');
const gutil = require("gulp-util");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackCleanPlugin = require("webpack-auto-clean-build-plugin");

module.exports = function(isProduction, watch) {
	watch = watch || false;
	process.env.NODE_ENV = isProduction ? "production" : "development";
	gutil.log("[webpack] isProduction: " + (isProduction ? "true" : "false"));

	function webpackOutput(cb) {
		return function(err, stats) {
			if(err) throw new gutil.PluginError("webpack", err);
			let statLog = stats.toString({
				assets: true,
				colors: true,
				version: false,
				hash: false,
				timings: false,
				chunks: false,
				chunkModules: false,
			});
			for (const line of statLog.split("\n")) {
				gutil.log("[webpack]", line);
			}
			cb && cb();
		}
	}
	const config = {
		reporter: webpackOutput,
		context: __dirname,
		entry: {
			vendor: [
				"babel-polyfill"
			],
			timings: ["./static/js/timings"]
		},
		watch: watch,
		bail: isProduction,
		debug: !isProduction,
		cache: !isProduction,
		devtool: isProduction ? 'cheap-module-source-map' : 'cheap-eval-source-map',
		output: {
			path: path.join(__dirname, "static/dist/"),
			publicPath: "static/dist/", // relative path for github pages
			filename: "[name].[chunkhash].js",
			chunkFilename: "chunk.[id].[chunkhash].js",
			pathinfo: !isProduction,
		},
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
		recordsOutputPath: path.join(__dirname, ".cache", "records.json"),
		module: {
			loaders: [
				{
					test: [/\.(js|jsx)$/],
					exclude: /node_modules/,
					loader: 'babel',

					query: {
						cacheDirectory: isProduction ? null : '.cache/babel',
						"presets": [
							["es2015", {"loose": true}],
							"react",
							"stage-0"
						],
						plugins: ['transform-runtime'],
						babelrc: false,
					}
				},
				{ test: /\.json$/,   loader: "json" },
				{ test: /\.css$/,    loader: "style" },
				{
					test: /\.sass$/,
					loader: "style!sass!autoprefixer"
				},
				{ test: /\.png$/,    loader: "url?prefix=img/&limit=5000" },
				{ test: /\.jpg$/,    loader: "url?prefix=img/&limit=5000" },
				{ test: /\.gif$/,    loader: "url?prefix=img/&limit=5000" },
				{ test: /\.woff$/,   loader: "url?prefix=font/&limit=5000" },
				{ test: /\.eot$/,    loader: "file?prefix=font/" },
				{ test: /\.ttf$/,    loader: "file?prefix=font/" },
				{ test: /\.svg$/,    loader: "file?prefix=font/" },
			]
		},
		plugins: [
			new WebpackCleanPlugin({path: path.join(__dirname, "static", "dist")}),
			new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
			new DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
			}),
			new OccurenceOrderPlugin(),
			new DedupePlugin(),
			new UglifyJsPlugin(),
			new AssetsPlugin({path: path.join(__dirname, "static", "dist")}),
			new CommonsChunkPlugin({
				name: 'vendor',
				async: false,
				children: true,
				minChunks: 3,
				filename: "vendor.[chunkhash].js",
			})
		],
		// examples for chunks: https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
		node: {
			fs: 'empty',
			net: 'empty',
			tls: 'empty'
		}
	};
	return config;
};
const main = path.basename(require.main.filename);
if (main !== 'gulp.js') {
	// running as main webpack process
	module.exports = module.exports(process.env.NODE_ENV === 'production');
}

function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }
