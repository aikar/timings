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
import TabbedContent from "./TabbedContent";

export default class TabbedPanel extends React.Component {

	static contextTypes = {
		tabPanel: React.PropTypes.instanceOf(TabbedContent)
	};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		const tabId = this.props.tabId;
		const isActive = this.context.tabPanel.state.activeTab === tabId;

		const attrs = {
			"aria-hidden": "false",
			id: "tabs-" + tabId
		};
		return <section {...attrs} className={"content" + (isActive ? " active" : "")}>
			{this.props.children}
		</section>
	}
}
