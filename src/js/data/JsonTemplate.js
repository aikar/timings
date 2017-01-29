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

export default class JsonTemplate {

	/**
	 * @param {object} data
	 * @param {object[]} mapQueue
	 */
	async _initializeData(data, mapQueue) {
		for (const [key, val] of Object.entries(data)) {
			this[key] = val;
			if (Array.isArray(val)) {
				for (let i = 0; i < val.length; i++) {
					if (typeof val[i][':cls'] !== 'undefined') {
						mapQueue.push({idx: i, val});
					}
				}
			} else if (typeof val === 'object') {
				if (typeof val[':cls'] !== 'undefined') {
					mapQueue.push({idx: key, val: this})
				}
			}
		}

		return this;
	}

	constructor() {}
}
