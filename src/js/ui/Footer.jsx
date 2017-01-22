
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

export default class Footer extends React.PureComponent {
	render() {
		return (
		<div id="footer">
			<span id="footer-left">&copy; 2013-{new Date().getYear()} Starlis LLC
				<a href="http://github.com/aikar/timings" title="Source">[source]</a>
				&mdash;
				<a href="https://aikar.co/" title="About / Donate">[about / donate]</a>
			</span>
			<span id="footer-right">Theme by Thomas Edwards</span>
		</div>
		);
	}
}
