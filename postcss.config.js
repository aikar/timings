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

const path = require('path');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');

module.exports = (ctx) => {
	const isProduction = ctx.environment === 'production';
	let plugins = [
		cssimport(),
		cssnext({
			compress: isProduction,
			messages: !isProduction
		}),
	];
	if (isProduction) {
		plugins.push(cssnano({
				discardComments: {
					removeAll: true
				},
				autoprefixer: false,
				styleCache: path.resolve('.cache/postcss'),

				sourcemap: true
			}));
		plugins.push(mqpacker());
	}
	return {
		plugins: plugins
	};
};
