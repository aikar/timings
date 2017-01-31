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

export default class ConfigView extends React.Component {
	static propTypes = ConfigView.props = {
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
