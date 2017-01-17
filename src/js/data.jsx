
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
import * as chart from './ui/chart';

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
	"Tile Entities": 25000,
	"Chunks": 3000,
	"Players": 100,
	"TPS": 20
};

export function initializeData() {
	data.stamps.forEach(function (k) {
		const d = new Date(k * 1000);
		chart.labels.push(d.toLocaleString());
	});
	data.tpsData.forEach(function (tps, i) {
		data.tpsData[i] = (tps / scales.TPS) * data.maxTime
	});
	data.plaData.forEach(function (count, i) {
		data.plaData[i] = (count / scales.Players) * data.maxTime
	});
	data.tentData.forEach(function (count, i) {
		data.tentData[i] = (count / scales["Tile Entities"]) * data.maxTime
	});
	data.entData.forEach(function (count, i) {
		data.entData[i] = (count / scales.Entities) * data.maxTime
	});
	data.chunkData.forEach(function (count, i) {
		data.chunkData[i] = (count / scales.Chunks) * data.maxTime
	});
}
