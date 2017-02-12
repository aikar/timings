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
		prefix: React.PropTypes.element,
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
		return (<span className="expandable">
			<span className="expand-prefix" onClick={this.toggle}>{this.props.prefix || null}</span>
			<span className="expand-arrows">
				{!this.state.expand ?
					<FA class='expand-control' icon='caret-right' onClick={this.toggle} />
					:
					<FA class='expand-control' icon='caret-down' onClick={this.toggle} />
				}
			</span>
			{this.state.expand ? <div className="expand-content">{this.props.children()}</div> : null}
		</span>);
	}
}
