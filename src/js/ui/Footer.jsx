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
			<span id="footer-left">&copy; 2013-{new Date().getFullYear()}
        &nbsp;Starlis LLC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;
			</span>
        <span id="footer-right">Theme by Thomas Edwards</span>
      </div>
    );
  }
}
