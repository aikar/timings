
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

import xhr from "xhr";
import qs from "qs";
//noinspection ES6UnusedImports
import TimingsMaster from "./data/TimingsMaster";
//noinspection ES6UnusedImports
import TimingHandler from "./data/TimingHandler";
import query from './query';
import clone from "clone";
import {min} from "lodash/math";
import JsonObject from "./data/JsonObject";

let dataReady = false;
let dataHasFailed = false;
let dataReadyCB = [];
let dataFailedCB = [];


const data = {
	history: {},
	ranges: [],
	start: 1,
	end: 1,
	maxTime: 1,
	stamps:[],
	lagData:[],
	tpsData:[],
	plaData:[],
	tentData:[],
	entData:[],
	chunkData:[],
};
/**
 * @type {TimingsMaster}
 */
data.timingsMaster = null;
/**
 * @type {TimingHandler}
 */
data.masterHandler = null;
/**
 * @type {Object<number,TimingHandler>}
 */
data.handlerData = {};

const scales = data.scales = {
	"Entities": 10000,
	"Tile Entities": 20000,
	"Chunks": 3000,
	"Players": 100,
	"TPS": 25
};
const scalesCap = data.scalesCap = {
	"Entities": 15000,
	"Tile Entities": 30000,
	"Chunks": 5000,
	"Players": 300,
	"TPS": 25
};
const scaleMap = data.scaleMap = {
	"Entities": {},
	"Tile Entities": {},
	"Chunks": {},
	"Players": {},
	"TPS": {}
};
data.labels = [];
data.loadData = async function loadData() {
	try {
		// TODO: lscache root data
		const [body] = await getData();

		for (const [key, value] of Object.entries(body)) {
			data[key] = value;
		}




		data.history = data.timingsMaster.data;
		const promise = loadTimingData(); // start the request and then do other stuff
		data.timingsMaster = await JsonObject.newObject(data.timingsMaster); // process into object while its downloading
		console.log(data.timingsMaster);



		data.stamps.forEach(function (k) {
			const d = new Date(k * 1000);
			data.labels.push(d.toLocaleString());
		});
		data.tpsData.forEach(function (tps, i) {
			data.tpsData[i] = scale("TPS", tps);
		});
		data.plaData.forEach(function (count, i) {
			data.plaData[i] = scale("Players", count);
		});
		data.tentData.forEach(function (count, i) {
			data.tentData[i] = scale("Tile Entities", count);
		});
		data.entData.forEach(function (count, i) {
			data.entData[i] = scale("Entities", count);
		});

		// TODO: Chunk data is NaN
		data.chunkData.forEach(function (count, i) {
			data.chunkData[i] = scale("Chunks", count)
		});

		await promise; // wait for main data to finish
		dataSuccess();
		console.log("DONE");

	} catch (e) {
		console.error(e);
	}
};

async function loadTimingData() {
	try {
		// TODO: lscache history segments
		const [body] = await getData({
			history: data.history
				.filter((h) => !h.data)
				.map((h) => h.id)
				.join(",")
		});

		for (const [key, history] of Object.entries(body.history)) {
			data.history[key].handlers = await JsonObject.newObject(history);
			//parseHistory(history);
		}
		console.log(data.history);
		data.masterHandler = data.handlerData[1];
		typeof cb === 'function' && cb(err);
	} catch(e) {
		console.error(e);
	}
}

/**
 *
 * @param {TimingHandler[]} handlers
 */
function parseHistory(handlers) {
	const handlerData = data.handlerData;
	for (const handler of handlers) {
		const id = handler.id.id;
		if (!handlerData[id]) {
			handlerData[id] = clone(handler);
			handlerData[id].mergedCount = 1;
			handlerData[id].mergedLagCount = handler.lagCount ? 1 : 0;
		} else {
			handlerData[id].addDataFromHandler(handler);
		}
		if (handler.id.name === "Full Server Tick" && data.masterHandler === null) {
			data.masterHandler = handlerData[id];
		}
	}
}

function buildSelfData() {
	for (const [id, handler] of Object.entries(data.handlerData)) {
		const record = new TimingData();
		const identity = new TimingIdentity();
		identity.id = handler.id.id + "-self";
		identity.name = "(SELF) " + handler.id.name;
		identity.group = handler.id.group;
		record.id = identity;
		for (const child of handler.children) {
			handler.childrenCount += child.mergedCount;
			handler.childrenLagCount += child.mergedLagCount;
			handler.childrenTotal += child.total || 0;
			handler.childrenLagTotal += child.lagTotal || 0;
		}

		record.total = handler.total - handler.childrenTotal;
		record.lagTotal = handler.lagTotal - handler.childrenLagTotal;
		record.count = handler.count - handler.childrenCount;
		record.lagCount = handler.lagCount - handler.childrenLagCount;
		handler.children[id] = record;
	}
}

async function getData(options={}) {
	options.id = query.get('id') || "";

	return new Promise((resolve, reject) => xhr('data.php', {
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify(options),
		responseType: "text",
		method: "post",
	}, (err, res, body) => {
		if (err || res.statusCode !== 200 || !body) {
			dataFailure();
			reject([err || res.statusText || "Status Code: " + res.statusCode, res]);
		} else {
			resolve([JSON.parse(body), res]);
		}
	}));
}

data.onFailure = function onFailure(cb) {
	if (dataHasFailed) {
		cb();
	} else {
		dataFailedCB.push(cb);
	}
};
data.onReady = function onReady(cb) {
	if (dataReady) {
		db(data);
	} else {
		dataReadyCB.push(cb);
	}
};

data.isDataReady = function isDataReady() {
	if (!timingsData || (Array.isArray(timingsData) && !timingsData.length)) {
		window.timingsData = null;
		return false;
	}
	return true;
};

function scale(key, count) {
	const res = (min(scalesCap[key], count) / scales[key]) * data.maxTime;
	scaleMap[key][res] = count;
	return res;
}

function dataFailure() {
	dataHasFailed = true;
	dataFailedCB.forEach((cb) => cb());
}

function dataSuccess() {
	dataReady = true;
	dataReadyCB.forEach((cb) => cb(data));
}

export default data;
