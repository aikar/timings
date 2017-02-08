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
import cx from "classnames";
import data from "../data";

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
			<Sticky stickyStyle={{zIndex: 2000}}>
				<div id="tab-panel" className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
					{Object.entries(this.props.tabs).map(([key, val]) => (
						<Tab key={key} tabId={key}>{val}</Tab>
					))}
				</div>
				<TimingsControls />
			</Sticky>
			{this.props.children}
		</div>;
	}
}
class TimingsControls extends React.Component {
	sort(sort) {
		data.changeOptions(sort, null, true);
		this.setState({updated: new Date()});
	}
	type(type) {
		data.changeOptions(null, type, true);
		this.setState({updated: new Date()});
	}
	render() {
		return <div id="controls">
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
