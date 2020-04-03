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
import {round} from "lodash/math";
import data from "../data";
import _ from "lodash";
import replaceColorCodes from "../mccolors";

function gcSummary() {
    const system = data.timingsMaster.system;

    let key=0;
    return _.flatten(Object.entries(system.gc).map(([type, gc]) => {
       return [<br key={key++} />, <span key={key++}>{
           type + ": avg(" + round(gc[0] ? gc[1] / gc[0] : 0, 2) + "ms) - rate(" + round(gc[0] ? system.runtime / gc[0] / 1000 : 0, 2) + "s)"
       }</span>];
    }));
}
export default class ServerInfo extends React.PureComponent {

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
    const info = data.timingsMaster;
    const motd = info.motd && info.motd !== "null" && replaceColorCodes(info.motd.replace("\n", ":|:NL:|:"));
    return (
      <div id="server-info" className="section">

        <div className="server-title">
          <img className="server-icon" src={"image.php?id=" + info.icon} width="48" height="48"/>
          <span className="server-name">{info.name}</span>
        </div>
        <table>
          <tbody>
          <tr>
            <td className="fieldName">Uptime</td>
            <td className="fieldValue">{round(info.system.runtime / 60 / 60 / 1000, 2)}hr</td>

            <td className="fieldName">Max Players</td>
            <td className="fieldValue">{info.maxplayers}</td>
          </tr>
          <tr>
            <td className="fieldName">Max Memory</td>
            <td className="fieldValue">{info.system.maxmem / 1024 / 1024}MB</td>

            <td className="fieldName">Online Mode</td>
            <td className="fieldValue">{this.showOnlineMode()}</td>
          </tr>
          {motd ?
            <tr>
              <td className="fieldName">MOTD</td>
              <td className="fieldValue" colSpan="3"
                  dangerouslySetInnerHTML={{__html: motd && motd.replace(":|:NL:|:", "<br/>")}}/>
            </tr> : null}
          <tr>
            <td className="fieldName">Version</td>
            <td className="fieldValue" colSpan="3">{info.version}</td>
          </tr>
          <tr>
             <td className="fieldName">GC</td>
             <td className="fieldValue" colSpan="3">
               {gcSummary()} <br />
               {info.system.flags.indexOf("using.aikars.flags") === -1 ? 
                   <span style={{color: 'red'}}>✗ Not using Aikar's flags <a href="https://mcflags.emc.gs" >FIX THIS</a></span> : 
                   <span style={{color: 'green'}}>✓ Using Aikar's flags</span> 
               }
             </td>
          </tr>
          </tbody>
        </table>
      </div>

    )
  }

  showOnlineMode() {
    const info = data.timingsMaster;
    const config = info.config;
    if (info.onlinemode === true) {
      return "Enabled";
    }

    if (config.spigot && config.spigot.settings && (config.spigot.settings.bungeecord == "true" || config.spigot.settings.bungeecord === true)) {
      return "BungeeCord";
    }
    return "Disabled";
  }
}
