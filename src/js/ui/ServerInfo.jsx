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
       const count = gc[0];
       const total = gc[1];
       const rate  = round(count ? system.runtime / count / 1000 : 0, 2);
       const avg   = round(count ? total / count : 0, 2) ;

	let avgColor = '';
	let rateColor = '';
	switch (type) {
	case 'ZGC': {
		avgColor = avg > 15 ? 'red' : (
			avg > 10 ? 'orange' : (
				avg > 8 ? 'yellow' : 'green' 
			)
		);
		rateColor = rate < 0.5 ? 'red' : (
			rate < 1 ? 'orange' : (
				rate < 2 ? 'yellow' : 'green'
			)
		) 
		break;
	}
	case 'G1 Young Generation': {
		avgColor = avg > 150 ? 'red' : (
			avg > 100 ? 'orange' : (
				avg > 50 ? 'yellow' : 'green' 
			)
		);
		rateColor = rate < 2 ? 'red' : (
			rate < 4 ? 'orange' : (
				rate < 5 ? 'yellow' : 'green' 
			) 
		)

		break;
	}
	case 'G1 Old Generation': {
		avgColor = rateColor = count > 0 ? 'red' : 0;
		break;
	}
	default: {

		avgColor= avg > 150 ? 'red' : (
			avg > 100 ? 'orange' : (
				avg > 50 ? 'yellow' : 'green' 
			)
		);
	}
       }
       return [<br key={key++} />, <span key={key++}>{type.replace(/ Generation$/, '')}: {count}
	- avg(<span style={{color: avgColor}}>{avg}ms</span>)
	- rate(<span style={{color: rateColor}}>{rate}s</span>)
       </span>];
    }));
}
function analyzeFlags() {
    const system = data.timingsMaster.system;
    const flags = system.flags;
    const gc = system.gc;
    if (gc.ZGC) {
       const count = gc.ZGC[0];
       const total = gc.ZGC[1];
       const rate  = round(count ? system.runtime / count / 1000 : 0, 2);
       const avg   = round(count ? total / count : 0, 2) ;

	if (avg < 15 && rate >= 3) {
		return <span style={{color: 'green'}}>✓ Good Performing ZGC</span>;
	} else {
		return <span style={{color: 'red'}}>✗ ZGC is not performing well for you, Switch to G1 <a href="https://mcflags.emc.gs" >FIX THIS</a></span>;
	}
    }
    if (flags.indexOf("using.aikars.flags") === -1 && flags.indexOf("G1NewSizePercent=") === -1) {
        return <span style={{color: 'red'}}>✗ Not using Aikar's flags <a href="https://mcflags.emc.gs" >FIX THIS</a></span>;
    }
    return <span style={{color: 'green'}}>✓ Using Aikar's flags</span>;
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
             <td className="fieldValue" colSpan="4">
               {gcSummary()} <br />
               {analyzeFlags()}
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
