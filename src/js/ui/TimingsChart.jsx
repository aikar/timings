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
import {htorgba} from './../util';
import {round} from "lodash/math";
import Chart from "chart.js/Chart.js";


export default class TimingsChart {
	constructor(dom) {
		if (dom) {
			this.dom = dom.getContext('2d');
		}
	}

	//noinspection JSMethodCanBeStatic
	/**
	 * @param data
	 */
	initialize(data) {
		if (!data) {
			console.error("NO DATA");
			return;
		}
		console.log(data);
		this.chartOptions = {
			animation: false,
			legendTemplate: "",
			showScale: false,
			pointHitDetectionRadius: 2,
			responsive: true,
			maintainAspectRatio: true,
			multiTooltipTemplate: function (v) {
				if (!v.datasetLabel) {
					return "";
				}
				try {
					if (v.datasetLabel === "LAG") {
						return round((v.value / data.maxTime) * 100) + "% TPS Loss";
					} else {
						let number = data.scaleMap[v.datasetLabel][v.value];
						if (v.datasetLabel === "TPS") {
							number = round(number * 100) / 100;
						} else {
							number = round(number);
						}
						return number + " " + v.datasetLabel;
					}
				} catch (e) {
					console.log(e.message, v.datasetLabel, data.scaleMap);
				}
			}
		};
		this.chartData = {
			labels: data.labels,
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
		};
		this.chart = new Chart(this.dom).Line(this.chartData, this.chartOptions);
	}
}

