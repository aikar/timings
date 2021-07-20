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

import Content from "./Content";
import ErrorDisplay from "./ErrorDisplay";
import Sidebar from "./Sidebar";
import query from "../query";
import Footer from "./Footer";

export default class ContentWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: window.location.hash ? window.location.hash.split("#")[1] : 'timings',
      loadedTips: false,
      tipsData: null,
    }

    this.updateTab = this.updateTab.bind(this);
  }

  async componentDidMount() {
    try {
      let res = await fetch('/analyze?id='+(query.get("id") || ""))
      let tipsData = await res.json();
      this.setState({ loadedTips: true, tipsData })
    } catch (e) {
      this.setState({ loadedTips: false, tipsData: null });
    }
  }

  updateTab(activeTab) {
    this.setState({
      activeTab
    });
  }

  render() {
    return (
      <div className="content-wrap">
        <div className="full-body">
          <div className="sidebar">
            <Sidebar updateTab={this.updateTab} loadedTips={this.state.loadedTips} tipsData={this.state.tipsData} />
          </div>
          <div className="body">
            <ErrorDisplay />
            <Content activeTab={this.state.activeTab} loadedTips={this.state.loadedTips} tipsData={this.state.tipsData} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
