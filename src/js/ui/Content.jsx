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
import Advertisement from "./Advertisement";
import TabbedContent from "./TabbedContent";
import TabbedPanel from "./TabbedPanel";

export default class Content extends React.Component {
	constructor(props, ctx) {
		super(props, ctx);

	}
	// <div>Oops! It looks like the Timings you were trying to load does not exists anymore! Timings are only stored for 30 days after access.</div>
	render() {
		return <div id="content">
			<div id="tab-bar" className="ui-tabs ui-widget ui-widget-content ui-corner-all">
				<TabbedContent
					tabs{{
						"lag": "Lag Tree View",
						"all": "All Tree View",
						"lagsummary": "Lag Summary View",
						"allsummary": "All Summary View",
					}}
				>
					<TabbedPanel tabId="lag">

					</TabbedPanel>
					<TabbedPanel tabId="all">

					</TabbedPanel>
					<TabbedPanel tabId="lagsummary">

					</TabbedPanel>
					<TabbedPanel tabId="allsummary">

					</TabbedPanel>

				</TabbedContent>


			</div>
		</div>;
	}
}
