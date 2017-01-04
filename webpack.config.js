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
	context: path.join(__dirname, "static/"),
	entry: path.join(__dirname, "static/js/timings.jsx"),
	output: {
		path: path.join(__dirname, "static/dist/"),
		//publicPath: "static/dist/", // relative path for github pages
		filename: "timings.js",
		//chunkFilename: "[hash]/js/[id].js",
		//hotUpdateMainFilename: "[hash]/update.json",
		//hotUpdateChunkFilename: "[hash]/js/[id].update.js"
	},
	resolve: {
		//modulesDirectories: ["node_modules"],
		extensions: ['.js', '.jsx']
	},
	//recordsOutputPath: path.join(__dirname, "records.json"),
	module: {
		loaders: [
			{
				test: [/\.(js|jsx)$/],
				exclude: /node_modules/,
				loader: 'babel',
				cacheDirectory: "cache",
				query: {
					presets: ['react', 'es2015', 'stage-1']
				}
			},
			{ test: /\.json$/,   loader: "json" },
			{ test: /\.coffee$/, loader: "coffee" },
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
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		})
	],
	//watch: true
};
function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }
