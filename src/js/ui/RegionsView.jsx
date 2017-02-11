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
import sortBy from "lodash/sortBy";
import * as phpjs from "phpjs";

export default class RegionsView extends React.Component {
	static propTypes = RegionsView.props = {
		children: React.PropTypes.any
	};

	static defaultProps = {};

	constructor(props, ctx) {
		super(props, ctx);
	}

	render() {

		const areaMap = [];
		for (const /*TimingHistory*/history of data.timingsMaster.data) {
			for (const /*World*/world of Object.values(history.worldData)) {
				for (const /*Region*/region of Object.values(world.regions)) {
					const worldName = world.worldName;
					const areaId = region.regionId;
					if (!areaMap[worldName]) {
						areaMap[worldName] = {};
					}

					if (!areaMap[worldName][areaId]) {
						areaMap[worldName][areaId] = {
							"count" : 0,
							"world" : world.worldName,
							"x"     : region.areaLocX,
							"z"     : region.areaLocZ,
							"e"     : {},
							"ec"    : 0,
							"te"    : {},
							"tec"   : 0,
						};
					}
					areaMap[worldName][areaId]['count'] += region.chunkCount;
					for (const [id, count] of Object.entries(region.tileEntities)) {
						if (!areaMap[worldName][areaId]['te'][id]) {
							areaMap[worldName][areaId]['te'][id] = 0;
						}
						areaMap[worldName][areaId]['te'][id] += count;
						areaMap[worldName][areaId]['tec'] += count;
					}
					for (const [id, count] of Object.entries(region.entities)) {
						if (!areaMap[worldName][areaId]['e'][id]) {
							areaMap[worldName][areaId]['e'][id] = 0;
						}
						areaMap[worldName][areaId]['e'][id] += count;
						areaMap[worldName][areaId]['ec'] += count;
					}
				}
			}
		}

		const worlds = [];
		for (const [world, chunks] of Object.entries(areaMap)) {
			let chunksSorted = sortBy(Object.entries(chunks), sortRegions);
			worlds.push(<div key={world}>
				<h3>{world}</h3>
				{chunksSorted.map(([areaId, region]) => {
					const breakdown = sortBy(Object.entries(Object.assign(region.te, region.e)), sortCounts);

					return <div key={areaId}>
						{world}:{region.x},{region.z}<br />
						Totals: {region.ec} Entities - {region.tec} Tile Entities<br />
						Area Seen: {region.count} times<br/><br/>
						<div className="chunk-row full-timing-row">
							{breakdown.map(([type, count]) => (
								<span key={type} className='indent full-child'>{type}: {count}</span>
							))}
						</div>
					</div>
				})}
			</div>)
		}

		return (<div>
			<br /><h2>NOTICE: Counts are NOT EXACT!!!</h2>These are summaries by region.<br />
			They are a representation of number of times seen within this selected history window.
			They will be much higher than seen in game. It is intended
			to help you identify where the most TE/E's are.<br/>A region can cover 512 blocks around the coordinates.<br /><br />
			{worlds}
		</div>);
	}
}

function sortRegions([areaId, region]) {
	return region['tec'] + region['ec'];
}
function sortCounts([id, count]) {
	return count;
}
