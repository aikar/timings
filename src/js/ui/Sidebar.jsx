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
import SidebarTimingsInfo from './SidebarTimingsInfo';
import TimingsControls from "./TimingsControls";
import FA from "./FA";

export default class Sidebar extends React.Component {

    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            activeTab: (location.hash && location.hash.substring(1)) || this.props.activeTab // TODO: Hash lookup/query string?
        };
    }

    isActive(tabId) {
        return this.state.activeTab === tabId;
    }

    setTab(tabId) {
        location.hash = tabId;
        this.setState({ activeTab: tabId });
        this.props.updateTab(tabId);
    }

    render() {
        return (
            <div className="sidebar-container">
                <div className="sidebar-navigation">
                    <div className="brand">
                        <h2>Timings v2</h2>
                    </div>
                </div>
                <div className="sidebar-navigation">
                    <ul>
                        <li>
                            <button onClick={() => this.setTab("timings")} className={((!this.state.activeTab) || this.state.activeTab === "timings") ? 'active' : ''}>
                                <FA icon='tachometer-alt' />
                                Overview
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.setTab("regions")} className={this.state.activeTab === "regions" ? 'active' : ''}>
                                <FA icon='map-marked-alt' />
                                Regions
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.setTab("config")} className={this.state.activeTab === "config" ? 'active' : ''}>
                                <FA icon='cog' />
                                Config
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.setTab("plugins")} className={this.state.activeTab === "plugins" ? 'active' : ''}>
                                <FA icon='puzzle-piece' />
                                Plugins
                            </button>
                        </li>
                        <li>
                            <button onClick={() => this.setTab("tips")} className={this.state.activeTab === "tips" ? 'active' : ''}>
                                <FA icon='lightbulb' />
                                Tips {this.props.loadedTips ? <span className="tips-badge">{this.props.tipsData.length}</span> : null}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="sidebar-navigation">
                    <div className="sidebar-navigation-header">Server Details</div>
                    <SidebarTimingsInfo />
                </div>
                <div className="sidebar-navigation">
                    <div className="sidebar-navigation-header">Options</div>
                    <TimingsControls />
                </div>
            </div>
        );
    }
}
