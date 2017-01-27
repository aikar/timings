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

export default class TimingRow extends React.Component {

	static childContextTypes = TimingRow.childContextTypes = TimingRow.context = {
		timingRowDepth: React.PropTypes.number.isRequired
	};

	static propTypes = TimingRow.props = {
		/**
		 * @type TimingHandler
		 */
		handler: React.PropTypes.instanceOf(TimingHandler).isRequired
	};
	static rowIdPool = 0;

	constructor(props, ctx) {
		super(props, ctx);
		this.rowId = TimingRow.rowIdPool++;
		this.state = {
			showChildren: false
		};
	}

	getChildContext() {
		return {
			timingRowDepth: this.context.timingRowDepth + 1
		};
	}

	render() {
		const id = `${this.props.handler.id}_${this.rowId}`;
		const depth = this.context.timingRowDepth % 5;
		/*
		// TODO: Process Map for depth control?
		 if (!isset($processMap[$id])) {
		 $processMap[$id] = 0;
		 }

		 if (++$processMap[$id] === 1) {
		 
		 }
		 --$processMap[$id];
		 */
		/*
// TODO: Filter and sort children
 if (!NOFILTER) {
 $children = array_filter($h->children, 'lagFilter');
 } else {
 $children = $h->children;
 }
 if (!empty($children)) {
 $children = array_map(function($v) {
 $tpl = Template::getInstance();
 $h = $tpl->handlerData[$v->id->id];
 $v->children = $h->children;
 return $v;
 }, $children);
 usort($children, 'lagSort');
 echo '<div class="children">';
 printRows($children, $level + 1);
 echo '</div>';
 }
 */
		return (
			<div className='full-timing-row'>
				<div className={`indent depth${depth} full-depth${depth}`}></div>
				<div id={`${id}`} className='timing-row'><a href={`#${id}`}>#</a>
					<TimingRecordData handler={this.handler} />
					<div className="children">
						{
							this.state.showChildren ? this.props.handler.children.map((child) => (
								<TimingRow key={child.id} handler={child} />
							)) : null
						}
					</div>
				</div>
			</div>
		);
	}
}


class TimingRecordData extends React.Component {

	static propTypes = TimingRecordData.props = {
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
			return;
		}

		let avg = round((total / count) / 1000000, 4);
		let tickAvg = round(avg * (count / totalTicks), 4);


		let totalPct = round((total / totalTime) * 100, 2);
		let pctOfTick, tickAvgMod;
		if (handler.name === "Full Server Tick") { // always 100%
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

		return (
			<div className='row-wrap'>
				<div className='name'>{cleanName(handler.id)}</div>
				<div className='row-info'>

					<div className='row-info-total'>count(<span className='count'>count</span>)
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

function lagFilter(handler) {
	handler['avg'] = 0;
	const count = handler[prop('count')];
	const total = handler[prop('total')];
	if (count > 0) {
		handler['avg'] = (total / count) * handler.mergedCount;
	}

	return total > 5;
}

const $replacements = [
	[/net\.minecraft\.server\.v[^.]+\./, 'nms.'],
	[/org\.bukkit\.craftbukkit\.v[^.]+\./, 'obc.'],
];
function cleanName($name) {
	const $orig = $name;
	for(const $pattern of $replacements) {
		$name = $name.replace($pattern[0], $pattern[1]);
	}
	$name = $name.replace(/Event: ([a-zA-Z0-9.]+) /, condensePackage);
	return <span title={$orig}>{$name}</span>;
}
function condensePackage($v) {
	let $name = explode('.', $v[1]);
	const $last = array_pop($name);
	$name = array_map(function($v) { return $v[0]; }, $name);
	$name.push($last);
	return 'Event: ' .implode('.', $name) + ' ';
}


/**
 *
 * @param {TimingHandler} h1
 * @param {TimingHandler} h2
 * @returns {number}
 */
function sortChildren(h1, h2) {
	const keyToCheck = prop('total');
	return h1[keyToCheck] > h2[keyToCheck] ? -1 : 1;
}
function pctView($val, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	return pctViewMod($val, 1, $t1, $t2, $t3, $t4);
}
function pctViewMod($val, $mod = 1, $t1 = 25, $t2 = 15, $t3 = 5, $t4 = 1) {
	let $valnum = number_format($val, 2);
	$val *= $mod;
	if ($val > $t1) {
		$valnum = <span className='warn-high'>$valnum</span>;
	} else if ($val > $t2) {
		$valnum = <span className='warn-med'>$valnum</span>;
	} else if ($val > $t3) {
		$valnum = <span className='warn-low'>$valnum</span>;
	} else if ($val > $t4) {
		$valnum = <span className='warn-none'>$valnum</span>;
	}

	return $valnum;
}








