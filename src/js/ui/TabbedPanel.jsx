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
import TabContainer from "./TabContainer";

export default class TabbedPanel extends React.Component {

	static contextTypes = {
		tabContainer: React.PropTypes.instanceOf(TabContainer)
	};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		const tabId = this.props.tabId;
		const isActive = this.context.tabContainer.isActive(tabId);
		if (!isActive) {
			return null;
		}

		const attrs = {
			"aria-hidden": "false",
			id: "tabs-" + tabId
		};
		return <section {...attrs} className={"content" + (isActive ? " active" : "")}>
			{this.props.children}
		</section>
	}
}
