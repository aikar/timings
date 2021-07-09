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
import data from '../data';
import FA from "./FA";

function colorScale(val, thresholds, colors = ['red', 'orange', 'yellow', 'green']) {
    for (const i in thresholds) {
        if (val > thresholds[i]) return colors[i];
    }
    return colors[colors.length - 1];
}

function colorBetween(val, red, amber, green, lowerIsBetter = false) {
    return val > red ? (lowerIsBetter ? 'red' : 'green') : (
        val > amber ? 'orange' : (
            val > green ? 'yellow' : 'green'
        )
    );
}

function gcSummary() {
    const system = data.timingsMaster.system;

    let key = 0;
    return Object.entries(system.gc).map(([type, gc]) => {
        const count = gc[0];
        const total = gc[1];
        const rate = round(count ? system.runtime / count / 1000 : 0, 2);
        const avg = round(count ? total / count : 0, 2);

        let avgColor = '';
        let rateColor = '';
        switch (type) {
            case 'ZGC': {
                avgColor = colorScale(avg, [15, 10, 8]);
                rateColor = colorScale(rate, [2, 1, 0.5], ['green', 'yellow', 'orange', 'red']);
                break;
            }
            case 'G1 Young Generation': {
                avgColor = colorScale(avg, [150, 125, 75]);
                rateColor = colorScale(rate, [5, 4, 2], ['green', 'yellow', 'orange', 'red']);
                break;
            }
            case 'G1 Old Generation': {
                avgColor = rateColor = count > 0 ? 'red' : 0;
                break;
            }
            default: {
                avgColor = colorScale(avg, [ 150, 100, 50 ]);
            }
        }
        return [
            <div key={key++} className="gc-cat">
                <div className="gc-name">{type.replace(/ Generation$/, '')} ({count})</div>
                <span style={{ color: avgColor }}>{avg}ms</span> / <span style={{ color: rateColor }}>{rate}s</span>
            </div>
        ];
    }).flat();
}

export default class SidebarTimingsInfo extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);

        this.state = {
            dataReady: false,
            activeTab: (location.hash && location.hash.substring(1)) || this.props.activeTab // TODO: Hash lookup/query string?
        };
        data.onReady(() => {
            this.setState({ dataReady: true });
        })
    }

    render() {
        if (!this.state.dataReady) return null;
        const info = data.timingsMaster;
        let version = info.version;
        if (version.includes(" (MC: ")) version = version.split(" (MC: ")[0];

        let minecraft = null;
        if (info.version.includes(" (MC: ")) minecraft = info.version.split(" (MC: ")[1].split(")")[0];

        let server_id = data.timingsMaster.server_id;

        return (
            <table className="sidebar-info">
                <tbody>
                    <tr>
                        <th className="fieldName" title="Uptime"><FA icon='hourglass-half' /></th>
                        <td className="fieldValue" colSpan="4">{round(info.system.runtime / 60 / 60 / 1000, 2)}hr</td>
                    </tr>
                    <tr>
                        <th className="fieldName" title="Version"><FA icon='code-branch' /></th>
                        <td className="fieldValue" colSpan="4">{version}</td>
                    </tr>
                    {
                        minecraft ? (
                            <tr>
                                <th className="fieldName" title="Minecraft"><FA icon='cube' /></th>
                                <td className="fieldValue" colSpan="4">Minecraft {minecraft}</td>
                            </tr>
                        ) : null
                    }
                    <tr>
                        <th className="fieldName" title="GC"><FA icon='recycle' /></th>
                        <td className="fieldValue" colSpan="4">{gcSummary()}</td>
                    </tr>
                    {
                        server_id ? (
                            <tr>
                                <th className="fieldName" title="Minecraft"><FA icon='server' /></th>
                                <td className="fieldValue" colSpan="4">Server {server_id}</td>
                            </tr>
                        ) : null
                    }
                </tbody>
            </table>
        );
    }

}