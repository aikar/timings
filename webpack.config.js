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
	entry: "./app/app.js",
	output: {
		path: path.join(__dirname, "static/dist/"),
		publicPath: "static/dist/", // relative path for github pages
		filename: "main.js", // no hash in main.js because index.html is a static page
		chunkFilename: "[hash]/js/[id].js",
		hotUpdateMainFilename: "[hash]/update.json",
		hotUpdateChunkFilename: "[hash]/js/[id].update.js"
	},
	recordsOutputPath: path.join(__dirname, "records.json"),
	module: {
		loaders: [
			{
				test: [/\.(js|jsx)$/],
				exclude: /node_modules/,
				loader: 'babel-loader',
				cacheDirectory: "cache",
				query: {
					presets: ['react', 'es2015']
				}
			},
			{ test: /\.json$/,   loader: "json-loader" },
			{ test: /\.coffee$/, loader: "coffee-loader" },
			{ test: /\.css$/,    loader: "style-loader" },
			{
				test: /\.sass$/,
				loader: "style-loader!sass-loader!autoprefixer-loader"
			},
			{ test: /\.png$/,    loader: "url-loader?prefix=img/&limit=5000" },
			{ test: /\.jpg$/,    loader: "url-loader?prefix=img/&limit=5000" },
			{ test: /\.gif$/,    loader: "url-loader?prefix=img/&limit=5000" },
			{ test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000" },
			{ test: /\.eot$/,    loader: "file-loader?prefix=font/" },
			{ test: /\.ttf$/,    loader: "file-loader?prefix=font/" },
			{ test: /\.svg$/,    loader: "file-loader?prefix=font/" },
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
	fakeUpdateVersion: 0
};
function escapeRegExpString(str) { return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); }
function pathToRegExp(p) { return new RegExp("^" + escapeRegExpString(p)); }
