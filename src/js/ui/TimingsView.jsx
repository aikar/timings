/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 * 
 * Modified by PebbleHost
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */

import React from "react";
import data from "../data";
import TimingRow from "./TimingRow";
import * as loadState from "../loadState";
import LoadingWheel from "./LoadingWheel";

export default class TimingsView extends React.Component {
  static propTypes = TimingsView.props = {
    children: React.PropTypes.any,
  };

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      limit: 40
    };
    data.provideTo(this);
  }

  render() {
    if (!this.state.timingHistoryReady) {
      return null;
    }

    let children = Object.values(data.handlerData);
    const propTotal = prop('total');
    const propCount = prop('count');

    const filter = lagFilter(propTotal, propCount, true);

    loadState.onStartLoading(() => {
      this.loadingIcon.style.display = 'block';
    });
    loadState.onFinishLoading(() => {
      this.loadingIcon.style.display = 'none';
    });

    children = children.filter(c => filter(c)).sort((a, b) => b[sortType] - a[sortType]);
    const count = children.length;

    children = children.slice(0, this.state.limit);
    return (
      <div style={{ position: 'relative' }}>
        <div ref={item => { this.loadingIcon = item; }} style={{ paddingTop: '50px', margin: '-15px -15px', backgroundColor: '#000000a0', display: 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, textAlign: 'center' }}>
          <LoadingWheel />
        </div>
        {children.map((handler) => {
          return <TimingRow timingRowDepth={0} key={handler.id} handler={handler}/>
        })}
        {count > this.state.limit ?
          <div id="show-more" onClick={() => this.setState({limit: this.state.limit + 20})}>Show More</div> : null}
      </div>
    );
  }
}
