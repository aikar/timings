
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

let dataReady = false;
let dataHasFailed = false;
let dataReadyCB = [];
let dataFailedCB = [];


const data = {
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
			"Content-Type": "application/json",
		},
		body: JSON.stringify({id}),
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
		data.chunkData.forEach(function (count, i) {
			data.chunkData[i] = scale("Chunks", count)
		});
		dataSuccess();
	});

	function scale(key, count) {
		const res = (Math.min(scalesCap[key], count) / scales[key]) * data.maxTime;
		scaleMap[key][res] = count;
		return res;
	}
};

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
