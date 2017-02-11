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
import Spinner from "react-spinkit";


export default class Loading extends React.Component {
	static propTypes = Loading.props = {
		children: React.PropTypes.any
	};

	static defaultProps = {};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		return (
			<div id="content">
				<div id="tab-bar" className="ui-tabs ui-widget ui-widget-content ui-corner-all">
					<div id="tab-panel" className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
						<div className="tab-title active" style={{width: "100%"}}>
							<a className="tab ui-tabs-anchor" style={{width: "100%"}}>&nbsp;</a>
						</div>

					</div>
					<section className={"content active"} style={{textAlign: "center"}}>
						<br /><br />
						<h3>Timings is currently loading</h3>
						<br /><br /><br />
						<Spinner spinnerName="three-bounce" />
						<br /><br /><br /><br /><br />
					</section>
				</div>
			</div>
		);
	}
}
