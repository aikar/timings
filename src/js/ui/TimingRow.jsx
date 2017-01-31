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
import TimingHandler from "../data/TimingHandler";
import data from "../data";
import flow from "lodash/flow";
import _fp from "lodash/fp";
import {round} from "lodash/math";

export default class TimingRow extends React.Component {

	static currentlyShowing = {};

	static propTypes = TimingRow.props = {
		timingParent: React.PropTypes.object,
		timingRowDepth: React.PropTypes.number,
		/**
		 * @type TimingHandler
		 */
		handler: React.PropTypes.instanceOf(TimingHandler).isRequired
	};

	static defaultProps = {
		timingRowDepth: 0,
	};

	static rowIdPool = 0;

	constructor(props, ctx) {
		super(props, ctx);
		this.rowId = TimingRow.rowIdPool++;
		this.state = {
			showChildren: false
		};
	}

	componentWillUnmount() {
		const handler = this.props.handler;
		delete TimingRow.currentlyShowing[handler.id];
	}
	render() {
		const handler = this.props.handler;
		if (!handler) {
			return null;
		}
		const id = handler.id;
		const rowId = `${id}_${this.rowId}`;
		const depth = this.props.timingRowDepth % 5;


		let children = null;
		if (handler.id === 1 || (/*!TimingRow.currentlyShowing[id] && */this.state.showChildren)) {
			const propTotal = prop('total');
			const propCount = prop('count');

			const filter = lagFilter.bind(handler.children, propTotal, propCount);
			const sorter = sortChildren.bind(null, propTotal);

			children = flow(
				_fp.filter(filter),
				_fp.sortBy(sorter),
				_fp.map((child) => {
					const childHandle = new TimingHandler();
					childHandle.id = child.id;
					childHandle.addData(child);
					childHandle.children = data.handlerData[child.id].children;
					return <TimingRow
						key={child.id}
						handler={childHandle}
						timingParent={handler}
						timingRowDepth={this.props.timingRowDepth + 1}
					/>
				})
			)(handler.children);
		}
		TimingRow.currentlyShowing[id] = 1;

		const toggleChildren = () => {
			console.log("show children", this);
			this.setState({showChildren: !this.state.showChildren});
		};
		return (
			<div className='full-timing-row'>
				<div className={`indent depth${depth} full-depth${depth}`} onClick={() => toggleChildren()}></div>
				<div id={`${rowId}`} className='timing-row'>
					<a href={`#${rowId}`} onClick={() => toggleChildren()}>#</a>
					<TimingRecordData
						handler={handler}
						timingRowDepth={this.props.timingRowDepth}
						onClick={() => toggleChildren()} />
					<div className="children">
						{children}
					</div>
				</div>
			</div>
		);
	}
}


class TimingRecordData extends React.Component {

	static propTypes = TimingRecordData.props = {
		timingRowDepth: React.PropTypes.number,
		/**
		 * @type TimingHandler
		 */
		handler: React.PropTypes.instanceOf(TimingHandler).isRequired,
	};

	constructor(props, ctx) {
		super(props, ctx);
	}
	render() {
		const handler = this.props.handler;
		const identity = data.getIdentity(handler.id);

		const propTotal = prop('total');
		const propCount = prop('count');

		/**
		 * @type TimingHandler
		 */
		const masterHandler = data.masterHandler;
		const totalTicks = masterHandler[propCount];
		const totalTime = masterHandler[propTotal];

		let total =  handler[propTotal];
		const count =  handler[propCount];

		if (count === 0) {
			return null;
		}

		let avg = round((total / count) / 1000000, 4);
		let tickAvg = round(avg * (count / totalTicks), 4);


		let totalPct = round((total / totalTime) * 100, 2);
		let pctOfTick, tickAvgMod;
		if (identity.name === "Full Server Tick") { // always 100%
			totalPct = pctView(totalPct, 200, 200, 200, 200);
			pctOfTick = pctView(tickAvg / 50 * 100, 90, 80, 75, 70);
		} else {
			tickAvgMod = tickAvg / 50 * 100;
			if (tickAvgMod) {
				tickAvgMod = totalPct / tickAvgMod;
			} else {
				tickAvgMod = 0;
			}
			totalPct = pctViewMod(totalPct, tickAvgMod, 50, 30, 20, 10);

			pctOfTick = pctView(tickAvg / 50 * 100, 50, 30, 20, 10);
		}
		const avgCountTick = number_format(count / totalTicks, 2);

//		console.log(avg,  tickAvg,  totalPct,  pctOfTick, avgCountTick, count, total)
		return (
			<div className='row-wrap'>
				<div className='name' title={identity.name}>{cleanName(identity.name)}</div>
				<div className='row-info'>

					<div className='row-info-total'>count(<span className='count'>{count}</span>)
						total(<span className='totalPct'>{totalPct}%</span>
						<span className='totalTime'>{round(total / 1000000000, 3)}s</span>,
						<span className='pctOfTick'>{pctOfTick}% of tick</span>)
					</div>

					<div className='row-info-avg'>
						avg(<span className='avgMs'>{pctView(avg)}ms</span> per -
						<span className='tickAvgMs'>{pctView(tickAvg)}ms/{avgCountTick} per tick</span>)
					</div>

				</div>
			</div>
		);
	}
}



function prop(type) {
	if (reportType === 'lag') {
		return type === 'count' ? 'lagCount' : 'count';
	} else {
		return type === 'count' ? 'lagTotal' : 'total';
	}
}

function lagFilter(propTotal, propCount, handler) {
	if (!handler) {
		return false;
	}

	let avg = 0;
	const count = handler[propCount];
	const total = handler[propTotal];
	if (count > 0) {
		avg = (total / count) * handler.mergedCount;
	}

	return total > 5; // TODO: avg?
}

const replacements = [
	[/net\.minecraft\.server\.v[^.]+\./, 'nms.'],
	[/org\.bukkit\.craftbukkit\.v[^.]+\./, 'obc.'],
];
function cleanName(name) {
	const orig = name;
	for(const pattern of replacements) {
		name = name.replace(pattern[0], pattern[1]);
	}
	name = name.replace(/Event: ([a-zA-Z0-9.]+) /, condensePackage);
	return <span title={orig}>{name}</span>;
}
function condensePackage(pkg) {
	let name = pkg.substring(7).split(/\./);
	const last = name.pop();
	name = name.map((v) => v[0]);
	name.push(last);
	return 'Event: ' + name.join(".") + ' ';
}


/**
 *
 * @param {string} keyToCheck
 * @param {TimingHandler} h1
 * @param {TimingHandler} h2
 * @returns {number}
 */
function sortChildren(keyToCheck, h1, h2) {
	if (!h1 || !h2) {
		return -1;
	}
	return h1[keyToCheck] > h2[keyToCheck] ? -1 : 1;
}
function pctView(val, t1 = 25, t2 = 15, t3 = 5, t4 = 1) {
	return pctViewMod(val, 1, t1, t2, t3, t4);
}
function pctViewMod(val, mod = 1, t1 = 25, t2 = 15, t3 = 5, t4 = 1) {
	let valNum = number_format(val, 2);
	val *= mod;
	if (val > t1) {
		valNum = <span className='warn-high'>$valnum</span>;
	} else if (val > t2) {
		valNum = <span className='warn-med'>$valnum</span>;
	} else if (val > t3) {
		valNum = <span className='warn-low'>$valnum</span>;
	} else if (val > t4) {
		valNum = <span className='warn-none'>$valnum</span>;
	}

	return valNum;
}








