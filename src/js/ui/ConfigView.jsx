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
			width: '100%',
			clear: 'left',
			overflow: 'hidden',
		};
		if (Array.isArray(val)) {
			return <div style={style}>
				<span className="key">{key}:</span>
				<span>[{val.map((v, i) => <TreeNode key={i} depth={this.props.depth+1} value={v} />)}]</span>
			</div>;
		} else if (typeof val === 'object') {
			return <div style={style}>
				<span style={{float: 'left'}}>{key}: </span>
				{!this.state.expand ?
					<i className='expand-control fa fa-fw fa-caret-right' onClick={() => toggleChildren()}/>
					:
					<div style={{float: 'left'}}>
						<i className='expand-control fa fa-fw fa-caret-down' onClick={() => toggleChildren()}/>
					{'{'}
						{Object.entries(val).map(([k, v]) => (<div key={k}>
								<TreeNode depth={this.props.depth + 1} keyname={k} value={v}/>
							</div>
						))}
					{'}'}</div>
				}
			</div>

		} else {
			return <div style={style}>{key? <span className="key">{key}:&nbsp;</span> : null}<span>{String(val)}</span></div>
		}
	}
}
