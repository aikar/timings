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
import Loading from "./Loading";

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

	render() {
		data.loadingIndicator = null;
		if (!this.state.dataReady) {
			return <Loading ref={(load) => data.loadingIndicator = load} isReady={false} />;
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
					<Loading ref={(load) => data.loadingIndicator = load} isReady={this.state.dataReady} />
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
