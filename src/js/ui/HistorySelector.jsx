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
require('rc-slider/dist/rc-slider.css');
import React from "react";
import TimingsChart from "./TimingsChart";
import Slider from "rc-slider"
import data from "../data";
import moment from "moment";

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
        <div className="section-head">
          <span className="section-title">Logging Period</span>
        </div>
        <div className="canvas-wrapper">
          <canvas ref={(ref) => {
            new TimingsChart(ref).initialize(data)
          }}
                  id="tps-graph"
                  width="98%" height="200"/>
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
    data.start = val[0];
    data.end = val[1];
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({updated: new Date()});
    data.refresh();
  }

  render() {
    const master = data.timingsMaster.data;
    return <div>
      <div id="time-selector">
        <Range step={1} pushable={0} dots included={true}
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
function date(time) {
  return moment(time * 1000).format('lll');
}
