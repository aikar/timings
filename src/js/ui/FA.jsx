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

export default function FA(props) {
	return props.onClick ?
		<i className={'fa fa-fw ' + props.class + ' fa-' + props.icon}
		   onClick={props.onClick} />
		:
		<i className={'fa fa-fw ' + props.class + ' fa-' + props.icon} />;
};
FA.propTypes = {
	children: React.PropTypes.any,
	class: React.PropTypes.string,
	icon: React.PropTypes.string.isRequired
};
