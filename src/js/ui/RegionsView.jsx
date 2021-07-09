/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 * 
 *  Modified by PebbleHost
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

import React from "react";
import ExpandControl from "./ExpandControl";

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
              "count": 0,
              "world": world.worldName,
              "x": region.areaLocX,
              "z": region.areaLocZ,
              "e": {},
              "ec": 0,
              "te": {},
              "tec": 0,
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
    return (<div>
      <h3>NOTICE: These are not chunks, counts are NOT EXACT!!!</h3>
      These are summaries by region.
      They are a representation of number of times seen within this selected history window.<br />
      They will be much higher than seen in game. It is intended
      to help you identify where the most TE/E's are.<br/>A region can cover 512 blocks around the
      coordinates.<br /><br />
      {Object.entries(areaMap).map(([world, chunks]) => (
        <WorldView key={world} world={world} chunks={Object.entries(chunks).sort((a, b) => (b[1].tec+b[1].ec) - (a[1].tec+a[1].ec))}/>
      ))}
    </div>);
  }
}

class WorldView extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      expanded: false
    }
  }

  render() {
    return <ExpandControl prefix={<h3>{this.props.world}</h3>}>{
      () => (<div className="world-item">{this.props.chunks.map(([areaId, region]) => (
        <div className="region-details" key={areaId}>
          <strong>{region.x},{region.z}</strong> (Area Seen {region.count} times)<br/>
          <ExpandControl prefix={<span>
						<strong>Totals</strong>: {region.ec} Entities - {region.tec}
            {' '} &mdash; {' '}
            Tile Entities - Summary:
					</span>}>{() => (
            <div className="chunk-row full-timing-row">
              {
                Object.entries(
                  Object.assign(region.te, region.e)
                )
                .sort((a, b) => {
                  return b[1] - a[1];
                })
                .map(([type, count]) => 
                  (
                    <span key={type} className='indent full-child'><strong>{type}</strong>: {count}</span>
                  )
                )
              }
            </div>)}
          </ExpandControl>
        </div>))}
      </div>)}
    </ExpandControl>;
  }
}
