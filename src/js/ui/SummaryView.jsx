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

export default class SummaryView extends React.Component {
	static propTypes = SummaryView.props = {
		children: React.PropTypes.any,
		reportType: React.PropTypes.string
	};

	static defaultProps = {
		reportType: "lag"
	};

	constructor(props, ctx) {
		super(props, ctx);
		window.reportType = props.reportType;
		data.provideTo(this);
	}

	render() {
		if (!this.state.timingHistoryReady) {
			return null;
		}
		return (
			<div />
		);
	}
}
