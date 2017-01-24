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

export default class Content extends React.Component {
	constructor(props, ctx) {
		super(props, ctx);

	}
	// <div>Oops! It looks like the Timings you were trying to load does not exists anymore! Timings are only stored for 30 days after access.</div>
	render() {
		return <div id="content">
			<div id="tab-bar" className="ui-tabs ui-widget ui-widget-content ui-corner-all">
				<TabContainer
					activeTab="lag"
					tabs={{
						"lag": "Lag Tree View",
						"all": "All Tree View",
						"lagsummary": "Lag Summary View",
						"allsummary": "All Summary View",
						"config": "All Summary View",
						"plugins": "Plugins",
					}}
				>
					<TabbedPanel tabId="lag">
						Lag Tree
					</TabbedPanel>
					<TabbedPanel tabId="all">
						All Tree
					</TabbedPanel>
					<TabbedPanel tabId="lagsummary">
						Lag Summary
					</TabbedPanel>
					<TabbedPanel tabId="allsummary">
						All Summary
					</TabbedPanel>
					<TabbedPanel tabId="config">
						Config
					</TabbedPanel>
					<TabbedPanel tabId="plugins">
						Plugins
					</TabbedPanel>
				</TabContainer>
			</div>
		</div>;
	}
}
