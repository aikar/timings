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
import {round} from "lodash/math";
import data from "../data";

export default class ServerInfo extends React.PureComponent {

	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			dataReady: false
		};
		data.onReady(() => this.setState({dataReady: true}));
	}
	render() {
		if (!this.state.dataReady) {
			return <div />;
		}
		const info = data.data.serverInfo;
		return (
			<div id="server-info" className="section">

				<div className="server-title">
					<img className="server-icon" src={"image.php?id=" + info.icon} width="48" height="48" />
					<span className="server-name">{info.name}</span>
				</div>
				<table><tbody>
					<tr>
						<td className="fieldName">Uptime</td>
						<td className="fieldValue">{round(info.system.runtime  / 60 / 60 / 1000, 2)}hr</td>

						<td className="fieldName">Max Players</td>
						<td className="fieldValue">{info.maxplayers}</td>
					</tr>
					<tr>
						<td className="fieldName">Max Memory</td>
						<td className="fieldValue">{info.system.maxmem / 1024 / 1024}MB</td>

						<td className="fieldName">Online Mode</td>
						<td className="fieldValue">{info.onlinemode === true ? "Enabled" : "Disabled"}</td>
					</tr>

					<tr>
						<td className="fieldName">MOTD</td>
						<td className="fieldValue" colSpan="3">{info.motd.split("\n")}</td>
					</tr>
					<tr>
						<td className="fieldName">Version</td>
						<td className="fieldValue" colSpan="3">{info.version}</td>
					</tr>
				</tbody></table>
			</div>

		)
	}
}
