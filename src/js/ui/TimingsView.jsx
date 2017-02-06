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
			limit: 20
		};
		data.provideTo(this);
	}

	render() {
		if (!this.state.timingHistoryReady) {
			return null;
		}

		let children = Object.values(data.handlerData);
		const propTotal = prop('total');
		const propCount = prop('count');

		const filter = lagFilter.bind(null, propTotal, propCount);

		children = flow(
			_fp.filter(filter),
			_fp.sortBy(propTotal)
		)(children).reverse().slice(0, this.state.limit);


		const updateType = (type) => {
			window.reportType = type;
			this.setState({reportType: type});
		};
		let allClass = "all";
		let lagClass = "lag";
		if (reportType === "lag") {
			lagClass += " active";
		} else {
			allClass += " active";
		}

		return (
			<div>
				<div id="type-toggle">
					<div className={lagClass}
					     onClick={() => updateType("lag")}>Lag</div>
					<div className={allClass}
					     onClick={() => updateType("all")}>All</div>
				</div>
				{children.map((handler) => {
					return <TimingRow key={handler.id} handler={handler} />
				})}
				<div id="show-more" onClick={()=> this.setState({limit: this.state.limit + 10})}>Show More</div>
			</div>

		);
	}
}
