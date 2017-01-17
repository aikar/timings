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
module.exports = {
	context: __dirname,
	entry: [
		"babel-polyfill",
		"./static/js/timings"
	],
	output: {
		path: path.join(__dirname, "static/dist/"),
		publicPath: "static/dist/", // relative path for github pages
		filename: "timings.js",
		//chunkFilename: "[hash]/js/[id].js",
		//hotUpdateMainFilename: "[hash]/update.json",
		//hotUpdateChunkFilename: "[hash]/js/[id].update.js"
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	//recordsOutputPath: path.join(__dirname, "records.json"),
	module: {
		loaders: [
			{
				test: [/\.(js|jsx)$/],
				exclude: /node_modules/,
				loader: 'babel',

				query: {
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
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 20 }),
	],
	// examples for chunks: https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	}
};
function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }
