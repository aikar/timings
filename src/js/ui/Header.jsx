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
import ThemeChooser from "./ThemeChooser";

export default class Header extends React.PureComponent {
	render() {
		return (
			<div id="header">
				<div className="site-title">
					Timings <small>v</small>2
					<div className="subtitle">Written by <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Aikar</a> </div>
				</div>

				<div id="header-right" className="section">
					<div className="section-head">
						<span className="section-title">Contribute or Donate? </span>
						<span className="section-controls">
					<a className="normal" href="http://github.com/aikar/timings"><i className="fa fa-github" /> Source</a>
							&nbsp;
					<a className="normal" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=payments%40starlis%2ecom&lc=US&item_name=Aikar%20Timings&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHostedGuest"><i className="fa fa-paypal"/> Donate</a>
				</span>
					</div>
					&copy; <a href='http://ref.emc.gs/?gas=timingsphp' rel="nofollow">Aikar</a>&nbsp;

					<span>This system has taken years to develop. If it has helped you, consider donating :)</span>
					<br />
						Requires <a href="http://paper.emc.gs" title="Paper Minecraft Server">Paper</a>
						&nbsp;or <a href="https://www.spongepowered.org" title="Sponge Minecraft Server">Sponge</a>&nbsp;
						[<a href="https://www.youtube.com/watch?v=T4J0A9l7bfQ" title="Timings v2 Tutorial">Video Tutorial</a>]
				</div>
				<ThemeChooser />
			</div>
		);
	}
}


