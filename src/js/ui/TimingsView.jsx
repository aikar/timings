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
import TimingRow from "./TimingRow";
import flow from "lodash/flow";
import _fp from "lodash/fp";
import cx from "classnames";
import {StickyContainer, Sticky} from "react-sticky";
export default class TimingsView extends React.Component {
	static propTypes = TimingsView.props = {
		children: React.PropTypes.any,
		reportType: React.PropTypes.string
	};

	static defaultProps = {
		reportType: "lag"
	};

	constructor(props, ctx) {
		super(props, ctx);
		window.reportType = props.reportType;
		this.state = {
			limit: 40
		};
		data.provideTo(this);
	}


	updateType(type) {
		data.changeOptions(null, type);
		this.setState({reportType: type});
	};
	updateSort(sort) {
		data.changeOptions(sort, null);
		this.setState({sortType: sort});
	};

	render() {
		if (!this.state.timingHistoryReady) {
			return null;
		}

		let children = Object.values(data.handlerData);
		const propTotal = prop('total');
		const propCount = prop('count');

		const filter = lagFilter(propTotal, propCount);

		children = flow(
			_fp.filter(filter),
			_fp.sortBy(sortType)
		)(children).reverse().slice(0, this.state.limit);
		return (
			<div>
				<div id="controls">

					<div id="sort-toggle">
						<div className={cx("totalPct", {active: sortType === "totalPct"})}
						     onClick={() => this.updateSort("totalPct")}>Total</div>
						<div className={cx("avg", {active: sortType === "avg"})}
						     onClick={() => this.updateSort("avg")}>Avg</div>
						<div className={cx("avgCountTick", {active: sortType === "avgCountTick"})}
						     onClick={() => this.updateSort("avgCountTick")}>Count</div>
					</div>
					<div id="type-toggle">
						<div className={cx("lag", {active: reportType === "lag"})}
						     onClick={() => this.updateType("lag")}>Lag</div>
						<div className={cx("all", {active: reportType === "all"})}
						     onClick={() => this.updateType("all")}>All</div>
					</div>
				</div>

				{children.map((handler) => {
					return <TimingRow timingRowDepth={0} key={handler.id} handler={handler} />
				})}
				<div id="show-more" onClick={()=> this.setState({limit: this.state.limit + 20})}>Show More</div>
			</div>

		);
	}
}
