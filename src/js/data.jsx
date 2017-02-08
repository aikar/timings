
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
import JsonObject from "./data/JsonObject";
import _ from "lodash";
import TimingData from "./data/TimingData";
import TimingIdentity from "./data/TimingIdentity";
import lscache from "lscache";

let dataReady = false;
let dataHasFailed = false;
let dataReadyCB = [];
let dataFailedCB = [];


const data = {
	first: 0,
	history: {},
	ranges: [],
	start: 0,
	end: 3,
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
	"Active Entities": 10000,
	"Tile Entities": 20000,
	"Chunks": 3000,
	"Players": 100,
	"TPS": 25
};
const scalesCap = data.scalesCap = {
	"Entities": 15000,
	"Active Entities": 15000,
	"Tile Entities": 30000,
	"Chunks": 5000,
	"Players": 300,
	"TPS": 25
};
const scaleMap = data.scaleMap = {
	"Entities": {},
	"Active Entities": {},
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
		data.timingsMaster = await JsonObject.newObject(data.timingsMaster); // process into object while its downloading
		data.history = data.timingsMaster.data;
		// repair motd if needed
		if (Array.isArray(data.timingsMaster.motd)) {
			data.timingsMaster.motd = data.timingsMaster.motd.join("\n");
		}
		let $version = data.timingsMaster.version;
		// Support a bug in Sponge that serialized an optional
		if (!empty($version['value'])) {
			$version = $version['value'];
		}
		if ($version === '$version') {
			$version = "Sponge IDE Dev";
		}
		data.timingsMaster.version = $version;

		let $ranges = [];
		let $first = -1;
		for (const /*TimingHistory*/history of data.timingsMaster.data) {
			$ranges.push(history.start);
			$ranges.push(history.end);
			if ($first === -1 || $first > history.start) {
				$first = history.start;
			}
		}
		data.first = $first;
		data.ranges = _.uniq($ranges);
		loadChartData();
		dataSuccess();
	} catch (e) {
		console.error(e);
	}
};
function loadChartData() {

	const $first = data.first;
	data.lagData = [];
	data.tpsData = [];
	data.tentData = [];
	data.entData = [];
	data.aentData = [];
	data.chunkData = [];
	data.plaData = [];
	data.stamps = [];

	data.maxTime = 0;
	let chunkCount = 0;
	for (const /*TimingHistory*/history of data.timingsMaster.data) {
		for (const /*World*/world of Object.values(history.worldData)) {
			for (const /*Region*/region of Object.values(world.regions)) {
				chunkCount += region.chunkCount;
			}
		}
		const firstMP = history.minuteReports[0];

		for (let $i = firstMP.time; $i - $first < 65; $i += 60) {
			const $clone = clone(firstMP, false);
			$clone.time = $first;
			history.minuteReports.unshift($clone);
		}

		for(const /*MinuteReport*/mp of history.minuteReports) {
			data.maxTime = max(mp.fullServerTick.total, data.maxTime);
		}
		for(const /*MinuteReport*/mp of history.minuteReports) {
			if (!mp.ticks.timedTicks) {
				continue;
			}

			data.stamps.push(mp.time);
			data.labels.push(new Date(mp.time * 1000).toLocaleString());
			data.tpsData.push(scale("TPS", mp.tps > 19.85 ? 20 : mp.tps));
			data.lagData.push(mp.fullServerTick.lagTotal);
			data.chunkData.push(scale("Chunks", chunkCount));
			data.entData.push(scale("Entities", mp.ticks.entityTicks / mp.ticks.timedTicks));
			data.plaData.push(scale("Players", mp.ticks.playerTicks / mp.ticks.timedTicks));
			data.aentData.push(scale("Active Entities", mp.ticks.activatedEntityTicks / mp.ticks.timedTicks));
			data.tentData.push(scale("Tile Entities", mp.ticks.tileEntityTicks / mp.ticks.timedTicks));
		}
	}
}

let requestId = 0;
async function loadTimingData() {
	// TODO: lscache history segments
	const neededIds = data.history
		.filter((h) => !h.handlers && h.id >= data.start && h.id <= data.end)
		.map((h) => h.id);
	requestId++;
	if (neededIds.length) {
		const thisRequest = requestId;
		for (const id of neededIds) {
			data.history[id].handlers = 1; // temp to block new requests for that ID
		}
		const [body] = await getData({
			history: neededIds.join(",")
		});

		for (const [key, history] of Object.entries(body.history)) {
			data.history[key].handlers = await JsonObject.newObject(history);
		}
		if (requestId !== thisRequest) {
			return; // A new request came in
		}
	}
	buildTimingData();
	data.masterHandler = data.handlerData[1];
}

function buildTimingData() {
	data.handlerData = {}; // Reset handler data
	const handlerData = data.handlerData;
	for (let i = data.start; i <= data.end; i++ ) {
		/**
		 * @type TimingHandler[]
		 */
		const handlers = data.history[i].handlers;
		//noinspection JSValidateTypes
		if (handlers === 1) {
			continue;
		}
		for (const /*TimingHandler*/handler of handlers) {
			const id = handler.id;
			if (!handlerData[id]) {
				handlerData[id] = clone(handler, false);
				handlerData[id].mergedCount = 1;
				handlerData[id].mergedLagCount = handler.lagCount ? 1 : 0;
			} else {
				handlerData[id].addDataFromHandler(handler);
			}
		}
	}
	buildSelfData();
}

data.refresh = function () {
	(async () => {
		await loadTimingData();
		dataSuccess();
	})();
};

function buildSelfData() {
	for (const [id, handler] of Object.entries(data.handlerData)) {
		const record = new TimingData();
		record.id = handler.id;
		record.isSelf = true;
		for (const child of Object.values(handler.children)) {
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

function getData(options={}) {
	options.id = query.get('id') || "";

	return new Promise((resolve, reject) => {
		xhr('data.php?' + qs.stringify(options), {
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			responseType: "text",
			method: "GET",
		}, (err, res, body) => {
			if (err || res.statusCode !== 200 || !body) {
				dataFailure();
				reject([err || res.statusText || "Status Code: " + res.statusCode, res]);
			} else {
				resolve([JSON.parse(body), res]);
			}
		})
	});
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
		cb(data);
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
	//noinspection ES6ModulesDependencies,NodeModulesDependencies
	const res = (Math.min(scalesCap[key], count) / scales[key]) * data.maxTime;
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


// TODO: Chunks
function chunkstuff() {
	const $areaMap = [];
	for (const /*TimingHistory*/$history of data.timingsMaster.data) {
		for (const /*World*/$world of $history.worldData) {
			for (const /*Region*/$region of $world.regions) {
				const $worldName = $world.worldName;
				const $areaId = $region.regionId;
				if (!$areaMap[$worldName]) {
					$areaMap[$worldName] = [];
				}

				if (!$areaMap[$worldName][$areaId]) {
					$areaMap[$worldName][$areaId] = {
						"count": 0,
						"world": $world.worldName,
						"x": $region.areaLocX,
						"z": $region.areaLocZ,
						"e": [],
						"ec": 0,
						"te": [],
						"tec": 0,
					};
				}
				$areaMap[$worldName][$areaId]['count'] += $region.chunkCount;
				for (const [$id, $count] of Object.entries($region.tileEntities)) {
					$areaMap[$worldName][$areaId]['te'][$id] += $count;
					$areaMap[$worldName][$areaId]['tec'] += $count;
				}
				for (const [$id, $count] of Object.entries($region.entities)) {
					$areaMap[$worldName][$areaId]['e'][$id] += $count;
					$areaMap[$worldName][$areaId]['ec'] += $count;
				}
			}
		}
	}
}

/**
 * @param {int} id
 * @returns {TimingIdentity}
 */
data.getIdentity = function (id)  {
	return data.timingsMaster.idmap.handlerMap[id];
};

data.provideTo = function(comp) {
	if (!comp.isReactComponent) {
		throw new Error("Must be a react component");
	}
	if (!comp.state) {
		comp.state = {};
	}
	comp.state.timingHistoryReady = false;
	let hasUnmounted = false;
	const prevUnmount = comp.componentWillUnmount;
	comp.componentWillUnmount = function () {
		hasUnmounted = true;
		if (prevUnmount) {
			prevUnmount.call(comp);
		}
	};

	data.onReady(async () => {
		await loadTimingData();
		if (!hasUnmounted) {
			comp.setState({timingHistoryReady: new Date()});
		}
	});
};





export default data;
