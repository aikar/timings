
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

export let data = window.timingsData || {
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
export const scales = {
	"Entities": 10000,
	"Tile Entities": 20000,
	"Chunks": 3000,
	"Players": 100,
	"TPS": 25
};
export const scalesCap = {
	"Entities": 15000,
	"Tile Entities": 30000,
	"Chunks": 5000,
	"Players": 300,
	"TPS": 25
};
export const scaleMap = {
	"Entities": {},
	"Tile Entities": {},
	"Chunks": {},
	"Players": {},
	"TPS": {}
};
data.labels = [];
export function initializeData() {
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

	function scale(key, count) {
		const res = (Math.min(scalesCap[key], count) / scales[key]) * data.maxTime;
		scaleMap[key][res] = count;
		return res;
	}
}
