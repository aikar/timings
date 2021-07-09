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
import data from "../data";

export default class TimingsControls extends React.Component {
  filterTimer;

  sort(sort) {
    data.changeOptions(sort, null, true);
    this.setState({updated: new Date()});
  }

  type(type) {
    data.changeOptions(null, type, true);
    this.setState({updated: new Date()});
  }

  onFilterChange = (e) => {
    const val = e.target.value;
    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }
    this.filterTimer = setTimeout(() => {
      this.setState({filter: val});
      data.setFilter(val);
      this.filterTimer = null;
    }, 300);
  };

  render() {
    let controls = {
      totalPct: "Total",
      avg: "Avg",
      avgCountTick: "Count"
    }
    return <div id="controls">
      <input id="filter" placeholder="Filter Results" type="text" onChange={this.onFilterChange}/>
      <div id="sort-toggle">
        {Object.keys(controls).map(control => (
          <div
            className={control + (sortType === control ? " active" : "")}
            onClick={() => this.sort(control)}
            key={control}
          >
            {controls[control]}
          </div>
        ))}
      </div>
      <div id="type-toggle">
        <div
          className={`lag${reportType === "lag" ? " active" : ""}`}
          onClick={() => this.type("lag")}
        >
          Lag (&gt;50ms)
        </div>
        <div
          className={`all${reportType === "all" ? " active" : ""}`}
          onClick={() => this.type("all")}
        >
          All
        </div>
      </div>
    </div>;
  }
}
