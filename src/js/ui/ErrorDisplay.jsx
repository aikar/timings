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
import data from "../data";

export default class ErrorDisplay extends React.Component {
  static propTypes = ErrorDisplay.props = {
    children: React.PropTypes.any
  };

  static defaultProps = {};

  constructor(props, ctx) {
    super(props, ctx);

    this.state = {
      error: false
    };
    data.onFailure(() => {
      this.setState({error: true});
    });
  }

  render() {
    if (!this.state.error) {
      return null;
    }
    return (
      <div id="content">
        <div id="tab-bar" className="ui-tabs ui-widget ui-widget-content ui-corner-all">
          <div id="tab-panel"
               className="tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
            <div className="tab-title active" style={{width: "100%"}}>
              <a className="tab ui-tabs-anchor" style={{width: "100%"}}>&nbsp;</a>
            </div>
          </div>
          <section className={"content active"} style={{textAlign: "center"}}>
            <br /><br />
            <h1>Oops - Could not load Timings Report</h1>
            <br /><br /><br />
            It looks like the Timings you were trying to load does not exists anymore!
            <br/><br/>
            Timings are only stored for 30 days after access, but this this looking to be increased.
            If this is a recent timings, then please recheck the URL given in your console.
            <br /><br /><br /><br /><br />
          </section>
        </div>
      </div>
    );
  }
}
