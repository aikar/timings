
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
import clone from "clone";
import {min} from "lodash/math";

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
data.loadData = function loadData() {
	const id = $.query.get('id') || "";

	xhr('data.php', {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify({id}),
		responseType: "text",
		method: "post",

	}, (err, res, body) => {

		if (err || res.statusCode !== 200) {
			dataFailure();
			return;
		}
		body = JSON.parse(body);
		if (!body) {
			dataFailure();
			return;
		}
		for (const [key, value] of Object.entries(body)) {
			data[key] = value;
		}

		data.history = data.timingsMaster.data;

		console.log(data);

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

		loadTimingData(id, (err) => {
			console.log("DONE", err);
			dataSuccess();
		});

	});

	function scale(key, count) {
		const res = (min(scalesCap[key], count) / scales[key]) * data.maxTime;
		scaleMap[key][res] = count;
		return res;
	}
};



function loadTimingData(id, cb) {
	xhr('data.php', {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: qs.stringify({
			id,
			history: data.history.filter((h) => !h.data).map((h) => h.id).join(","),
		}),
		responseType: "text",
		method: "post",

	}, (err, res, body) => {

		if (err || res.statusCode !== 200) {
			dataFailure();
			return;
		}
		body = JSON.parse(body);
		if (!body) {
			dataFailure();
			return;
		}

		for (const [key, history] of Object.entries(body.history)) {
			data.history[key].handlers = history;
			//parseHistory(history);
		}
		console.log(data.history);
		data.masterHandler = data.handlerData[1];
		typeof cb === 'function' && cb(err);
	});
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

function dataFailure() {
	dataHasFailed = true;
	dataFailedCB.forEach((cb) => cb());
}

function dataSuccess() {
	dataReady = true;
	dataReadyCB.forEach((cb) => cb(data));
}

export default data;
