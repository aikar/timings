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
import MinuteReport from "./MinuteReport";
import Plugin from "./Plugin";
import Region from "./Region";
import TicksRecord from "./TicksRecord";
import TimingData from "./TimingData";
import TimingHandler from "./TimingHandler";
import TimingHistory from "./TimingHistory";
import TimingIdentity from "./TimingIdentity";
import TimingsMap from "./TimingsMap";
import TimingsMaster from "./TimingsMaster";
import TimingsSystemData from "./TimingsSystemData";
import World from "./World";

export default class JsonTemplate {
	static classMap = null;

	/**
	 * Asynchronously create a JSON represented object.
	 *
	 * @param data
	 * @returns {*}
	 */
	static async newObject(data) {
		return await createObject(data, false);
	}

	/**
	 * Rebuilds JS Object into classes in a non recursive manner.
	 * This is to avoid the risk of stack overflow issues as Timings
	 * data can be very deep.
	 *
	 * As each data object is processed, its children are added onto the processing stack,
	 * so only the root request does remapping operations.
	 *
	 * We also support asynchronous object creation to avoid browsers warning about long operations.
	 *
	 * @param {object} data
	 * @param {object[]} mapQueue
	 * @param {boolean=} skipInit Should init be skipped
	 */
	async _initializeData(data, mapQueue, skipInit=false) {
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

		if (!skipInit) {
			await this._processQueue(cb);
		}
		return this;
	}

	async _processQueue() {
		let item;
		let i = 0;
		while (item = this.classMapQueue.pop()) {
			const thisIdx = item.idx;
			const thisData = item.val[thisIdx];
			const newObj = createObject(thisData, true);
			item.val[thisIdx] = await newObj._initializeData(thisData, this.classMapQueue, false);

			if (i++ % 300 === 0 && this.classMapQueue.length) {
				await timeout(10);
			}
		}
		return this;
	}

	classMapQueue = [];
	constructor() {}
}
function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function createObject(data, skipInit=false) {
	if (!JsonTemplate.classMap) {
		JsonTemplate.classMap = {
			1: MinuteReport,
			2: Plugin,
			3: Region,
			4: TicksRecord,
			5: TimingData,
			6: TimingHandler,
			7: TimingHistory,
			8: TimingIdentity,
			9: TimingsMap,
			10: TimingsMaster,
			11: TimingsSystemData,
			12: World,
		};
	}
	const id = data[':cls'];
	let objCls = JsonTemplate.classMap[id];
	if (typeof id !== 'undefined' && typeof objCls === 'function') {
		/**
		 * @type JsonTemplate
		 */
		const tpl = new objCls;
		if (!(tpl instanceof JsonTemplate)) {
			throw new Error(objCls.name + " is not instanceof JsonTemplate");
		}
		if (!skipInit) {
			await tpl._initializeData(data, tpl.classMapQueue, skipInit);
		}
		return tpl;
	}
	if (id) {
		throw new Error("Unknown class ID:", id, data);
	}
	return data;
}
