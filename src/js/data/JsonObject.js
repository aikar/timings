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
		const classMapQueue = [];
		const obj = await createObject(data);
		initializeData(obj, data, classMapQueue);
		await processQueue(classMapQueue);
		return obj;
	}
}

/**
 *
 * @param {DeferredDecode[]} classMapQueue
 * @returns {Promise.<void>}
 */
async function processQueue(classMapQueue) {
	let item;
	while (item = classMapQueue.pop()) {
		const thisIdx = item.idx;
		const thisData = item.val[thisIdx];
		item.val[thisIdx] = createObject(thisData);
		initializeData(item.val[thisIdx], thisData, classMapQueue);

		if (decodedInstances++ > 500 && classMapQueue.length) {
			await waitFor(10);
			decodedInstances = 0;
		}
	}
}

/**
 * @param {JsonTemplate} obj
 * @returns {JsonTemplate}
 */
async function decodeObj(obj) {
	if (typeof obj._rawData !== 'undefined') {
		const queue = [];
		initializeData(obj, obj._rawData, queue);
		await processQueue(queue);
		delete obj['_rawData'];
	}
	return obj;
}

/**
 * @param {JsonTemplate} obj
 * @returns {object}
 */
function rawData(obj) {
	if (typeof obj._rawData !== 'undefined' && obj._rawData) {
		return obj._rawData;
	}
	return null;
}
/**
 * @param {object} obj
 * @param {object} data
 * @param {DeferredDecode[]} mapQueue
 */
function initializeData(obj, data, mapQueue) {
	for (const [key, val] of Object.entries(data)) {
		obj[key] = val;
		if (Array.isArray(val)) {
			for (let i = 0; i < val.length; i++) {
				if (typeof val[i][':cls'] !== 'undefined') {
					mapQueue.push({idx: i, val});
				}
			}
		} else if (typeof val === 'object') {
			if (typeof val[':cls'] !== 'undefined') {
				mapQueue.push({idx: key, val: obj})
			}
		}
	}
}
/**
 * @param data
 * @returns {Promise.<JsonTemplate>}
 */
async function createObject(data) {
	const id = data[':cls'];
	const objCls = CLASS_MAP[id];

	if (typeof id !== 'undefined' && typeof objCls === 'function') {
		/**
		 * @type JsonTemplate
		 */
		const tpl = new objCls;
		if (!(tpl instanceof JsonTemplate)) {
			throw new Error(objCls.name + " is not instanceof JsonTemplate");
		}
		const deferDecoding = tpl._deferDecoding;

		delete tpl['decode'];
		delete tpl['rawData'];
		delete tpl[':cls'];
		delete tpl['_deferDecoding'];

		Object.defineProperty(tpl, 'decode', {
			enumerable: false,
			value: decodeObj.bind(tpl, tpl)
		});
		Object.defineProperty(tpl, 'rawData', {
			enumerable: false,
			value: rawData.bind(tpl, tpl)
		});
		if (deferDecoding) {
			Object.defineProperty(tpl, '_rawData', {
				enumerable: false,
				value: data
			});
		}


		return tpl;
	}
	throw new Error("Unknown class ID:", id, data);
}

/**
 * @typedef {{idx: *, val: *}} DeferredDecode
 */
