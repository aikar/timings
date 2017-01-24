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

export default class TabbedContent extends React.Component {

	static childContextTypes = {
		tabPanel: React.PropTypes.instanceOf(TabbedContent)
	};

	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			activeTab: "lagsummary" // TODO: Hash lookup/query string?
		};
	}

	getChildContext() {
		return {
			tabPanel: this
		};
	}

	render() {
		return <div className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
			<div id="tab-panel">
				{Object.entries(this.props.tabs).map(([key, val]) => (
					<Tab key={key} tabId={key}>{val}</Tab>
				))}
			</div>
		</div>;
	}
}

class Tab extends React.PureComponent {

	static contextTypes = {
		tabPanel: React.PropTypes.instanceOf(TabbedContent)
	};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		const tabId = this.props.tabId;
		const isActive = this.context.tabPanel.state.activeTab === tabId;
		return <div className={"tab-title tab-" + tabId + isActive ? ' active' : ''}>
			<a className="tab ui-tabs-anchor">{this.props.children}</a>
		</div>
	}
}
