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
import data from "../data";
import cx from "classnames";

export default class TimingsControls extends React.Component {
	filterTimer;

	sort(sort) {
		data.changeOptions(sort, null, true);
		this.setState({updated: new Date()});
	}
	type(type) {
		data.changeOptions(null, type, true);
		this.setState({updated: new Date()});
	}

	onFilterChange = (e) => {
		const val = e.target.value;
		if (this.filterTimer) {
			clearTimeout(this.filterTimer);
		}
		this.filterTimer = setTimeout(() => {
			this.setState({filter: val});
			data.setFilter(val);
			this.filterTimer = null;
		}, 300);
	};

	render() {
		return <div id="controls">
			<input id="filter" placeholder="Filter Results" type="text" onChange={this.onFilterChange} />
			<div id="sort-toggle">
				<div className={cx("totalPct", {active: sortType === "totalPct"})}
				     onClick={() => this.sort("totalPct")}>Total</div>
				<div className={cx("avg", {active: sortType === "avg"})}
				     onClick={() => this.sort("avg")}>Avg</div>
				<div className={cx("avgCountTick", {active: sortType === "avgCountTick"})}
				     onClick={() => this.sort("avgCountTick")}>Count</div>
			</div>
			<div id="type-toggle">
				<div className={cx("lag", {active: reportType === "lag"})}
				     onClick={() => this.type("lag")}>Lag</div>
				<div className={cx("all", {active: reportType === "all"})}
				     onClick={() => this.type("all")}>All</div>
			</div>
		</div>;
	}
}
