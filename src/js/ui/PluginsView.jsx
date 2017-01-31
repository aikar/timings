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

export default class PluginsView extends React.Component {
	static propTypes = PluginsView.props = {
		children: React.PropTypes.any
	};

	static defaultProps = {};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {
		return (
			<div />
		);
	}
}
