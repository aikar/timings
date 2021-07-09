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
require('rc-slider/dist/rc-slider.css');
import React from "react";
import TimingsChart from "./TimingsChart";
import Slider from "rc-slider"
import data from "../data";
import * as loadState from "../loadState";

const Range = Slider.Range;
export default class HistorySelector extends React.PureComponent {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      dataReady: false
    };
    data.onReady(() => this.setState({dataReady: true}));
  }

  render() {
    if (!this.state.dataReady) {
      return <div />;
    }

    return (
      <div id="history-selector" className="section">
        <div className="canvas-wrapper">
          <TimingsChart data={data} />
        </div>
        <TimeSelector />
      </div>
    )
  }
}
class TimeSelector extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.onHistoryChange = this.onHistoryChange.bind(this);
  }

  onHistoryChange(val) {
    loadState.startLoading();
    this.rangeSlider.disabled = true;
    setTimeout(() => {
      data.start = val[0];
      data.end = val[1];
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.setState({updated: new Date()});
      data.refresh();
      loadState.finishLoading();
      this.rangeSlider.disabled = false;
    }, 70);
  }

  render() {
    const master = data.timingsMaster.data;
    return <div>
      <div id="time-selector">
        <Range step={1} pushable={0} ref={item => { this.rangeSlider = item; }} dots included={true}
               allowCross={true} min={0} max={master.length - 1}
               defaultValue={[data.start, data.end]}
               onAfterChange={this.onHistoryChange}
        />
      </div>
      <span id="start-time">{date(master[data.start].start)}</span> - <span
      id="end-time">{date(master[data.end].end)}</span>
    </div>
  }
}

/* A bit messy but mitigates the need to include the entirety of moment.js in the bundle */
function date(time) {
  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  var date = new Date(time * 1000);
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}
