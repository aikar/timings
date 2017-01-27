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

import React from "react";
import TimingsChart from "./TimingsChart";
import data from "../data";

export default class HistorySelector extends React.PureComponent {
	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			dataReady: false
		};
		data.onReady(() => this.setState({dataReady: true}));
	}

	render() {
		if (!this.state.dataReady) {
			return <div />;
		}
		return (
			<div id="history-selector" className="section">
				<div className="section-head">
					<span className="section-title">Logging Period</span>
				</div>
				<div className="canvas-wrapper">
					<canvas ref={(ref) => {
						new TimingsChart(ref).initialize(data)
					}}
					id="tps-graph"
					width="98%" height="200" />
				</div>
				<div id="time-selector"></div>
				<span id="start-time" /> - <span id="end-time" />
			</div>
		)
	}

	static initializeTimeSelector() {
		let start = data.start;
		let end = data.end;
		let values = data.ranges;

		const times = [];
		for (let t of values) {
			if (times.indexOf(t) == -1) {
				times.push(t);
			}
		}

		const $timeSelector = $('#time-selector');
		$timeSelector.slider({
			min: 0,
			max: times.length - 1,
			values: [times.indexOf(start), times.indexOf(end)],
			range: true,
			slide: function (event, ui) {
				start = times[ui.values[0]];
				end = times[ui.values[1]];
				updateRanges(start, end);
			}
		});
		$timeSelector.on('slidestart', clearDataReload);
		$timeSelector.on('slidechange', loadNewData);

		updateRanges(start, end);

		let dataReloadTimer = 0;
		function clearDataReload() {
			if (dataReloadTimer) {
				clearTimeout(dataReloadTimer);
				dataReloadTimer = 0;
			}
		}

		function loadNewData() {
			clearDataReload();
			dataReloadTimer = setTimeout(function () {
				// TODO: Re-process data with new range
			}, 1500);
		}

		function updateRanges(start, end) {
			const startDate = new Date(start * 1000);
			const endDate = new Date(end * 1000);

			$('#start-time').text(startDate.toLocaleString());
			$('#end-time').text(endDate.toLocaleString());
		}
	}

}
