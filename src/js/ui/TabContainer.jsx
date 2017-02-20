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
import {StickyContainer, Sticky} from "react-sticky";

export default class TabContainer extends React.Component {

  static childContextTypes = {
    tabContainer: React.PropTypes.instanceOf(TabContainer)
  };
  static propTypes = TabContainer.props = {
    stickyChildren: React.PropTypes.any,
    children: React.PropTypes.any
  };

  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      activeTab: (location.hash && location.hash.substring(1)) || this.props.activeTab // TODO: Hash lookup/query string?
    };
  }

  getChildContext() {
    return {
      tabContainer: this
    };
  }

  isActive(tabId) {
    return this.state.activeTab === tabId;
  }

  setTab(tabId) {
    location.hash = tabId;
    this.setState({activeTab: tabId});
  }

  render() {
    return <StickyContainer>
      <Sticky stickyStyle={{zIndex: 2000}}>
        <div id="tab-panel"
             className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
          {Object.entries(this.props.tabs).map(([key, val]) => (
            <Tab key={key} tabId={key}>{val}</Tab>
          ))}
        </div>
        {this.props.stickyChildren || null}
      </Sticky>
      {this.props.children}
    </StickyContainer>;
  }
}

class Tab extends React.Component {

  static contextTypes = {
    tabContainer: React.PropTypes.instanceOf(TabContainer)
  };

  static propTypes = Tab.props = {
    tabId: React.PropTypes.string.isRequired,
    children: React.PropTypes.any
  };

  constructor(props, ctx) {
    super(props, ctx);
  }

  render() {
    const tabId = this.props.tabId;
    const isActive = this.context.tabContainer.isActive(tabId);
    return <div className={"tab-title tab-" + tabId + (isActive ? ' active' : '')}>
      <a className="tab ui-tabs-anchor"
         onClick={() => this.context.tabContainer.setTab(tabId)}
      >{this.props.children}</a>
    </div>
  }
}
