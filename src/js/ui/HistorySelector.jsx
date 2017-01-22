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
import * as data from "../data";

export default class HistorySelector extends React.PureComponent {
	
	render() {
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
}
