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
import JsonTemplate from "./JsonTemplate";

let decodedInstances = 0;
const CLASS_MAP = {
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
export default class JsonObject {

	/**
	 * Asynchronously create a JSON represented object.
	 *
	 * Rebuilds JS Object into classes in a non recursive manner.
	 * This is to avoid the risk of stack overflow issues as Timings
	 * data can be very deep.
	 *
	 * As each data object is processed, its children are added onto the processing stack,
	 * so only the root request does remapping operations.
	 *
	 * We build asynchronously to avoid browsers warning about long operations.
	 *
	 * @param data
	 * @returns {*}
	 */
	static async newObject(data) {
		const queue = [];
		if (Array.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				const arrData = data[i];
				data[i] = createObject(arrData);
				initializeData(data[i], arrData, queue);
			}
			await processQueue(queue);
			return data;
		} else {
			const obj = createObject(data);
			initializeData(obj, data, queue);
			await processQueue(queue);
			return obj;
		}
	}
}

/**
 *
 * @param {QueuedDecode[]} queue
 * @returns {Promise.<void>}
 */
async function processQueue(queue) {
	let item;
	while (item = queue.pop()) {
		const thisIdx = item.idx;
		if (!item.val) {
			console.error(item);
		}
		const thisData = item.val[thisIdx];
		if (thisData[':cls']) {
			item.val[thisIdx] = createObject(thisData);
			initializeData(item.val[thisIdx], thisData, queue);
		} else if (typeof item.val[thisIdx] === 'object') {
			queueDecodes(item.val[thisIdx], queue)
		}


		if (decodedInstances++ > 10000 && queue.length) {
			await waitFor(10);
			decodedInstances = 0;
		}
	}
}

/**
 * @param {JsonTemplate} tpl
 * @param {object} data
 * @returns {JsonTemplate}
 */
async function decodeObj(tpl, data) {
	for (const [key, val] of Object.entries(data)) {
		tpl[key] = val;
	}
	const queue = [];
	queueDecodes(tpl, queue);
	await processQueue(queue);
	delete tpl['decode'];
	Object.defineProperty(tpl, 'decode', {
		enumerable: false,
		value: async function() {
			return tpl;
		}
	});

	return obj;
}

/**
 * @param {JsonTemplate} tpl
 * @param {object} data
 * @param {QueuedDecode[]} queue
 */
function initializeData(tpl, data, queue) {
	const deferDecoding = tpl._deferDecoding;
	delete tpl['_deferDecoding'];
	delete tpl['decode'];
	delete tpl['rawData'];

	Object.defineProperty(tpl, 'rawData', {
		enumerable: false,
		value: () => data
	});

	if (deferDecoding) {
		Object.defineProperty(tpl, 'decode', {
			enumerable: false,
			value: decodeObj.bind(tpl, tpl, data)
		});
	} else {
		for (const [key, val] of Object.entries(data)) {
			tpl[key] = val;
		}
		queueDecodes(tpl, queue);
		Object.defineProperty(tpl, 'decode', {
			enumerable: false,
			value: async function() {
				return tpl;
			}
		});
	}
}

/**
 * @param {object,object[]} obj
 * @param {QueuedDecode[]} queue
 */
function queueDecodes(obj, queue) {
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			if (obj[i] && typeof obj[i] === 'object') {
				queue.push({idx: i, val: obj});
			}
		}
	} else {
		for (const [key, val] of Object.entries(obj)) {
			if (val && typeof val === 'object') {
				queue.push({idx: key, val: obj});
			}
		}
	}

}
/**
 * @param data
 * @returns {JsonTemplate}
 */
function createObject(data) {
	const id = data[':cls'];
	const objCls = CLASS_MAP[id];

	if (typeof id !== 'undefined' && typeof objCls === 'function') {
		/**
		 * @type JsonTemplate
		 */
		const tpl = new objCls;
		delete tpl[':cls'];

		return tpl;
	}
	console.error("Unknown Class Data:", data);
	throw new Error("Unknown class ID:" + id);
}

/**
 * @typedef {{idx: *, val: *}} QueuedDecode
 */
