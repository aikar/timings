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
import FA from "./FA";

export default class ExpandControl extends React.Component {
	static propTypes = ExpandControl.props = {
		children: React.PropTypes.func.isRequired,
		expanded: React.PropTypes.bool,
	};

	static defaultProps = {
		expanded: false
	};

	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			expand: props.expanded
		}
	}

	toggle = () => {
		this.setState({expand: !this.state.expand});
	};

	render() {
		return (<span>
			{!this.state.expand ?
				<FA class='expand-control' icon='caret-right' onClick={this.toggle} />
				:<span>
					<FA class='expand-control' icon='caret-down' onClick={this.toggle} />
					{this.props.children()}
				</span>
			}
		</span>);
	}
}
