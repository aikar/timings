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
import data from "../data";
import FA from "./FA";

export default class ConfigView extends React.Component {
	static propTypes = ConfigView.props = {
		children: React.PropTypes.any
	};

	static defaultProps = {};

	constructor(props, ctx) {
		super(props, ctx);
		data.provideTo(this);
	}

	render() {
		if (!this.state.timingHistoryReady) {
			return null;
		}
		const test = {
			foo: "bar",
			baz: {
				duck: [42, 53]
			}
		};

		return (
			<div>{Object.entries(data.timingsMaster.config).map(([type, config]) => (
				<TreeNode key={type} depth={0} keyname={type} value={config} />
			))}
			</div>
		);
	}
}

class TreeNode extends React.Component {
	static propTypes = TreeNode.props = {
		keyname: React.PropTypes.string,
		value: React.PropTypes.any.isRequired,
		depth: React.PropTypes.number
	};
	static defaultProps = {
		depth: 0
	};

	constructor(props, ctx) {
		super(props, ctx);
		this.state = {
			expand: props.expand || false
		};
	}

	render() {

		const val = this.props.value;
		const key = this.props.keyname;

		const toggleChildren = () => {
			this.setState({expand: !this.state.expand});
		};

		const style = {
			marginLeft: this.props.depth ? 25 : 10,
		};
		if (Array.isArray(val)) {
			return <div style={style}>
				<span className="key">{key}:&nbsp;</span>
				<span>[{val.map((v, i) => <TreeNode key={i} depth={this.props.depth} value={v} />)}]</span>
			</div>;
		} else if (typeof val === 'object') {
			return <div style={style}>
				<span className="key" onClick={() => toggleChildren()}>{key}: </span>
				{!this.state.expand ?
					<FA class='expand-control' icon='caret-right' onClick={() => toggleChildren()} />
					:<span>
						<FA class='expand-control' icon='caret-down' onClick={() => toggleChildren()} />{' {'}
						<div>
						{Object.entries(val).map(([k, v]) => (<div key={k}>
								<TreeNode depth={this.props.depth + 1} keyname={k} value={v}/>
							</div>
						))}
						</div>
					{'}'}
					</span>
				}
			</div>;
		} else {
			return <div style={style}>{key? <span className="key">{key}:&nbsp;</span> : null}<span>{String(val)}</span></div>
		}
	}
}
