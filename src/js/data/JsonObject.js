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
		await obj._initializeData(data, classMapQueue);
		await processQueue(classMapQueue);
		return obj;
	}
}

async function processQueue(classMapQueue) {
	let item;
	let i = 0;
	while (item = classMapQueue.pop()) {
		const thisIdx = item.idx;
		const thisData = item.val[thisIdx];
		const newObj = createObject(thisData);
		item.val[thisIdx] = await newObj._initializeData(thisData, classMapQueue);

		if (i++ % 300 === 0 && classMapQueue.length) {
			await timeout(10);
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
		return tpl;
	}
	throw new Error("Unknown class ID:", id, data);
}

function timeout(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

