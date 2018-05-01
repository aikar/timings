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
    showChildren: React.PropTypes.bool,
    /**
     * @type TimingHandler
     */
    handler: React.PropTypes.instanceOf(TimingHandler).isRequired
  };

  static defaultProps = {
    timingRowDepth: 1,
  };

  static rowIdPool = 0;

  constructor(props, ctx) {
    super(props, ctx);
    this.rowId = TimingRow.rowIdPool++;
    this.state = {
      showChildren: this.props.showChildren || false
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
    const rowId = this.props.timingParent ? `${this.props.timingParent.id}_${handler.id}` : handler.id;
    const depth = (this.props.timingRowDepth > 0 ? this.props.timingRowDepth % 5 : "none");


    let children = null;
    const childCount = Object.keys(handler.children).length;
    if (this.state.showChildren && !handler.isSelf && childCount > 1) {
      const propTotal = prop('total');
      const propCount = prop('count');

      const filter = lagFilter(propTotal, propCount);
      children = flow(
        _fp.filter(filter),
        _fp.sortBy(sortType),
        _fp.map((child) => {
          if (!data.handlerData[child.id]) {
            console.error("Missing Handler", child.id, child, this);
            return null;
          }
          const childHandle = new TimingHandler();
          childHandle.id = child.id;
          childHandle.addData(child);
          data.calculateStats(childHandle);
          if (child.isSelf) {
            childHandle.isSelf = true;
          }
          childHandle.children = data.handlerData[child.id].children;
          return <TimingRow
            key={child.id}
            handler={childHandle}
            timingParent={handler}
            timingRowDepth={this.props.timingRowDepth + 1}
          />
        })
      )(handler.children).reverse();
    }

    let childControl = (childCount < 2 || handler.isSelf) ? null
      : (
        !children ?
          <i className='expand-control fa fa-fw fa-caret-right' onClick={() => toggleChildren()}/>
          :
          <i className='expand-control fa fa-fw fa-caret-down' onClick={() => toggleChildren()}/>
      );

    const toggleChildren = () => {
      this.setState({showChildren: !this.state.showChildren});
    };
    return (
      <div className='full-timing-row'>
        <div className={`indent depth${depth} full-depth${depth}`} onClick={() => toggleChildren()}></div>
        <div id={`${rowId}`} className='timing-row'>
          {/*{id !== 1 ? <a href={`#${rowId}`} onClick={() => toggleChildren()}>#</a> : null}*/}
          {childControl}
          <TimingRecordData
            handler={handler}
            timingRowDepth={this.props.timingRowDepth}
            onClick={() => toggleChildren()}/>
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
    onClick: React.PropTypes.func
  };

  constructor(props, ctx) {
    super(props, ctx);
  }

  render() {
    const handler = this.props.handler;
    const identity = data.getIdentity(handler.id);

    const propTotal = prop('total');
    const propCount = prop('count');

    const total = handler[propTotal];
    const count = handler[propCount];

    if (count === 0) {
      return null;
    }

    let avg = round(handler.avg / 1000000, 4);
    let tickAvg = round(handler.tickAvg, 4);
    let totalPct = round(handler.totalPct, 2);

    let pctOfTick, tickAvgMod;
    let name = data.timingsMaster.idmap.groupMap[identity.group] + "::" + identity.name;
    if (handler.isSelf) {
      name += " (SELF)";
    }
    if (name === "Minecraft::Full Server Tick") { // always 100%
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
    const avgCountTick = number_format(handler.avgCountTick, 2);

    return (
      <div className='row-wrap' onClick={this.props.onClick}>
        <div className='name' title={name}>{cleanName(name)}</div>
        <div className='row-info'>

          <div className='row-info-total'>count(<span className='count'>{count}</span>)&nbsp;
            total(<span className='totalPct'>{totalPct}%</span>&nbsp;
            <span className='totalTime'>{round(total / 1000000000, 3)}s</span>,&nbsp;
            <span className='pctOfTick'>{pctOfTick}% of tick</span>)
          </div>

          <div className='row-info-avg'>
            avg(<span className='avgMs'>{pctView(avg)}ms</span> per -&nbsp;
            <span className='tickAvgMs'>{pctView(tickAvg)}ms/{avgCountTick} per tick</span>)
          </div>

        </div>
      </div>
    );
  }
}









