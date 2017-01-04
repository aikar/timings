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
import {htorgba} from "./../util";
import * as data from './../data';
import * as Math from "lodash/math";

export let labels = [];
export function initializeChart() {
	return new Chart($('#tps-graph').get(0).getContext("2d")).Line({
		labels: labels,
		datasets: [
			{
				data: [data.maxTime],
				PointDotRadius: 0,
				pointStrokeWidth: 0
			},
			{
				label: "TPS",
				//fillColor: "rgba(145,255,156,.6)",
				//fillColor: htorgba("136b06", .8),
				fillColor: htorgba("#ABFFA8", .8),
				strokeColor: "rgba(16,109,47,.7)",
				pointColor: "rgba(16,109,47,.7)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: data.tpsData
			}, {
				label: "LAG",
				//fillColor: htorgba("8d0707",0.8),
				fillColor: htorgba("ff8e01", 0.8),
				strokeColor: "rgba(255,60,60,1)",
				pointColor: "rgba(255,60,60,1)",
				pointStrokeColor: "#ff5533",
				pointHighlightFill: "#ff5533",
				pointHighlightStroke: "rgba(151,187,205,1)",
				data: data.lagData
			},
			{
				label: "Players",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#4F80FF",
				pointStrokeColor: "#DBF76A",
				data: data.plaData
			},
			{
				label: "Tile Entities",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#DBF76A",
				pointStrokeColor: "#DBF76A",
				data: data.tentData
			},
			{
				label: "Entities",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#84E2FF",
				pointStrokeColor: "#84E2FF",
				data: data.entData
			},
			{
				label: "Chunks",
				fillColor: "rgba(0,0,0,0)",
				pointColor: "#9324B5",
				pointStrokeColor: "#9324B5",
				data: data.chunkData
			}
		]
	}, {
		animation: false,
		legendTemplate: "",
		showScale: false,
		pointHitDetectionRadius: 2,
		responsive: true,
		maintainAspectRatio: false,
		multiTooltipTemplate: function (v) {
			if (v.datasetLabel == "LAG") {
				return Math.round((v.value / data.maxTime) * 100) + "% TPS Loss";
			} else {
				return (Math.round(v.value / data.maxTime * data.scales[v.datasetLabel] * 100) / 100) + " " + v.datasetLabel;
			}
		}
	});
}

