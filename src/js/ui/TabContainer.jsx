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
import {StickyContainer, Sticky} from "react-sticky";
export default class TabContainer extends React.Component {

	static childContextTypes = {
		tabContainer: React.PropTypes.instanceOf(TabContainer)
	};

	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			activeTab: this.props.activeTab // TODO: Hash lookup/query string?
		};
	}

	getChildContext() {
		return {
			tabContainer: this
		};
	}

	isActive(tabId) {
		return this.state.activeTab === tabId;
	}

	setTab(tabId) {
		this.setState({activeTab: tabId});
	}

	render() {
		return <div>
			<Sticky stickyStyle={{zIndex: 2000}} onStickyStateChange={(x) => (x ? document.body.classList.add('sticky') : document.body.classList.remove('sticky'))}>
				<div id="tab-panel" className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
					{Object.entries(this.props.tabs).map(([key, val]) => (
						<Tab key={key} tabId={key}>{val}</Tab>
					))}
				</div>
			</Sticky>
			{this.props.children}
		</div>;
	}
}

class Tab extends React.PureComponent {

	static contextTypes = {
		tabContainer: React.PropTypes.instanceOf(TabContainer)
	};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		const tabId = this.props.tabId;
		const isActive = this.context.tabContainer.isActive(tabId);
		return <div className={"tab-title tab-" + tabId + (isActive ? ' active' : '')}>
			<a className="tab ui-tabs-anchor"
				onClick={() => this.context.tabContainer.setTab(tabId)}
			>{this.props.children}</a>
		</div>
	}
}
