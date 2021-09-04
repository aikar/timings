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
import Footer from "./Footer";
import data from "../data";

export default class ContentWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: window.location.hash ? window.location.hash.split("#")[1] : 'timings'
    }

    this.updateTab = this.updateTab.bind(this);
    data.provideTo(this);
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
            <Sidebar updateTab={this.updateTab} />
          </div>
          <div className="body">
            <ErrorDisplay />
            <Content activeTab={this.state.activeTab} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
