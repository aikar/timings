/*
 * Copyright (c) (2021) - PebbleHost Timings Theme
 *
 *  Written by PebbleHost Team <support@pebblehost.com>
 *    + Contributors (See AUTHORS)
 *
 *  https://pebblehost.com
 *  
 *  See full license at /src/css/themes/LICENSE
 *
 */

import React from "react";
import RegionsView from "./RegionsView";
import PluginsView from "./PluginsView";
import TipsView from "./TipsView";
import ConfigView from "./ConfigView";
import TimingsView from "./TimingsView";
import HistorySelector from "./HistorySelector";
import data from "../data";
import Loading from "./Loading";

export default class Content extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      dataReady: false
    };
    data.onReady(() => {
      this.setState({dataReady: true});
    })
  }

  render() {
    data.loadingIndicator = null;
    if (!this.state.dataReady) {
      return <Loading ref={(load) => data.loadingIndicator = load} isReady={false}/>;
    }

    return <div>
      <div style={{ display: this.props.activeTab === "timings" ? 'block' : 'none'}} className="tab">
        <div className="tab-ct-wrapper less-padding">
          <div className="tab-ct-header">Timings Report</div>
          <HistorySelector/>
        </div>
        <div className="tab-ct-wrapper">
          <div className="tab-ct-header">Breakdown</div>
          <TimingsView reportType="lag"/>
        </div>
      </div>
      <div style={{ display: this.props.activeTab === "regions" ? 'block' : 'none' }} className="tab-ct-wrapper">
        <div className="tab-ct-header">Regions</div>
        <RegionsView />
      </div>
      <div style={{ display: this.props.activeTab === "config" ? 'block' : 'none' }} className="tab-ct-wrapper">
        <div className="tab-ct-header">Config</div>
        <ConfigView />
      </div>
      <div style={{ display: this.props.activeTab === "plugins" ? 'block' : 'none' }} className="tab-ct-wrapper">
        <div className="tab-ct-header">Plugins</div>
        <PluginsView />
      </div>
      <div style={{ display: this.props.activeTab === "tips" ? 'block' : 'none' }} className=" tips">
        <TipsView loaded={this.props.loadedTips} data={this.props.tipsData} />
      </div>
    </div>;
  }
}
