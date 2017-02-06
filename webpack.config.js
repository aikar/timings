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
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const gutil = require("gulp-util");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
const EnvironmentPlugin = require('webpack/lib/EnvironmentPlugin');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackAutoCleanBuildPlugin = require("webpack-auto-clean-build-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const cssPattern = '_[name]_[local]-[hash:5]';
const themes = fs.readdirSync(path.join(__dirname, "src/css/themes/")).map((themeFile) => {
	return themeFile.match(/(.*)\.scss/)[1];
});
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
				if (!/\.(css|js)\.map/.test(line)) {
					gutil.log("[webpack]", line);
				}
			}
			cb && cb();
		}
	}

	const config = {
		context: __dirname,
		entry: {
			vendor: [
				"babel-polyfill",
				"es7-shim",
				"jquery",
				"chart.js",
				"react",
				"react-dom",
			],
			timings: ["./src/js/timings"]
		},
		watch: watch,
		bail: isProduction,
		cache: !isProduction,
		devtool: isProduction ? 'source-map' : 'source-map',
		output: {
			path: path.join(__dirname, "dist"),
			publicPath: "dist/",
			filename: "[name].js",
			chunkFilename: "chunk.[id].js",
			pathinfo: !isProduction,
		},
		resolve: {
			extensions: ['.js', '.jsx']
		},
		recordsOutputPath: path.join(__dirname, ".cache", "records.json"),
		module: {
			rules: [
				{
					test: [/\.(js|jsx)$/],
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: isProduction ? null : '.cache/babel',
							"presets": [
								["es2015", {loose: true, modules: false}],
								"react",
								"stage-0"
							],
							plugins: [
								'lodash'
							],
							sourceMap: true,
							babelrc: false,
						}
					}
				},

				//{ test: /\.css$/, use: ["style-loader"] },
				{
					test: /\.scss$/,
					exclude: /(node_modules)/,
					loader: ExtractTextPlugin.extract({
						fallback: 'style-loader?sourceMap',
						use: [
							{
								loader: 'css-loader',
								query: {
									imports: false,
									sourceMap: true,
									localIdentName: cssPattern,
									importLoaders: 1
								}
							},
							'postcss-loader',
							{
								loader: 'sass-loader',
								query: {
									sourceMap: true
								}
							}
						]
					})
				},
				{
					test: /\.(png|jpg|gif)$/, use: [{
						loader: "url-loader",
						options: {
							prefix: "img/",
							limit: 5000
						}
					}]
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: [{
						loader: "url-loader",
						options: {
							limit: 10000,
							mimetype: "application/font-woff"
						}
					}],
				},
				{
					test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: [{
						loader: "url-loader",
						options: {
							limit: 10000,
							mimetype: "application/octet-stream"
						}
					}]
				},
				{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: ["file-loader"] },
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: [{
						loader: "url-loader",
						options: {
							limit: 10000,
							mimetype: "image/svg+xml"
						}
					}]
				}
			]
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({
				minimize: isProduction,
				debug: !isProduction,
				options: {
					context: __dirname,
					sourceMap: true,
				}
			}),
			//new LodashModuleReplacementPlugin(), //  not sure on this one yet.
			/*new CleanWebpackPlugin([path.join(__dirname, "dist")], {
				verbose: false,
			}),
			new WebpackAutoCleanBuildPlugin(),*/
			new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
			new DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
				'process.env.TIMINGS_THEMES': JSON.stringify(themes),
			}),
			isProduction ? new UglifyJsPlugin({
				mangle: true,
				sourceMap: true,
			}) : null,
			new AssetsPlugin({path: path.join(__dirname, "dist")}),
			new CommonsChunkPlugin({
				name: 'vendor',
				minChunks: 3,
				filename: "vendor.js",
			}),
			new ExtractTextPlugin({
				//id: "foo",
				filename: "[name].css",
				disable: false,
				allChunks: false
			}),
			function() {
				// Delete the empty .js files for themes
				const compiler = this;
				compiler.plugin("emit", (result, callback) => {
					for (const id of Object.keys(result.assets)) {
						if (id.match(/timings-theme.*\.js(\.map)?$/)) {
							delete result.assets[id];
						}
					}
					return callback();
				});
			}
		],
		// examples for chunks: https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
		node: {
			fs: 'empty',
			net: 'empty',
			tls: 'empty'
		}
	};

	for (const theme of themes) {
		config.entry['timings-theme-' + theme] = "./src/css/themes/" + theme + ".scss";
	}

	config.plugins = config.plugins.filter((plugin) => plugin); // remove nulls
	Object.defineProperty(config, 'reporter', {
		value: webpackOutput,
		enumerable: false
	});
	return config;
};
const main = path.basename(require.main.filename);
if (main !== 'gulp.js') {
	// running as main webpack process
	module.exports = module.exports(process.env.NODE_ENV === 'production');
}

function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }
