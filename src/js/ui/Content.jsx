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
import TabbedPanel from "./TabbedPanel";
import RegionsView from "./RegionsView";
import PluginsView from "./PluginsView";
import ConfigView from "./ConfigView";
import TimingsView from "./TimingsView";
import TimingsControls from "./TimingsControls";
import data from "../data";

export default class Content extends React.Component {
	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			dataReady: false
		};
		data.onReady(() => {
			this.setState({dataReady: true});
		})
	}
	// <div>Oops! It looks like the Timings you were trying to load does not exists anymore! Timings are only stored for 30 days after access.</div>
	render() {
		if (!this.state.dataReady) {
			return null;
		}
		return <div id="content">
			<div id="tab-bar" className="ui-tabs ui-widget ui-widget-content ui-corner-all">
				<TabContainer
					activeTab="timings"
					tabs={{
						"timings": "Timings",
						"regions": "Regions",
						"config": "Config",
						"plugins": "Plugins",
					}}
					stickyChildren={<TimingsControls />}
				>
					<TabbedPanel tabId="timings">
						<TimingsView reportType="lag" />
					</TabbedPanel>
					<TabbedPanel tabId="config">
						<ConfigView />
					</TabbedPanel>
					<TabbedPanel tabId="regions">
						<RegionsView />
					</TabbedPanel>
					<TabbedPanel tabId="plugins">
						<PluginsView />
					</TabbedPanel>
				</TabContainer>
			</div>
		</div>;
	}
}
