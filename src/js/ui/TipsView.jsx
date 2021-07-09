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
import FA from "./FA";
import LoadingWheel from "./LoadingWheel";
import AnimateHeight from 'react-animate-height';

let colors = {
  "warning": "indianred",
  "increase": "rgb(33, 144, 212)",
  "decrease": "rgb(33, 144, 212)",
  "enable": "rgb(33, 144, 212)",
  "disable": "rgb(33, 144, 212)",
};

export default class TipsView extends React.Component {
  static propTypes = TipsView.props = {
    children: React.PropTypes.any
  };

  static defaultProps = {};

  constructor(props, ctx) {
    super(props, ctx);

  }

  render() {
    if (!this.props.loaded) {
      return <div style={{ textAlign: 'center' }}><LoadingWheel /></div>;
    }

    var tips = {};
    for (const tip of this.props.data.tips) {
      if (!tips.hasOwnProperty(tip.file)) tips[tip.file] = [];
      tips[tip.file].push(tip);
    }
    tips = Object.keys(tips).sort((a, b) => tips[a].length - tips[b].length).map(k => <TipCollection key={k} file={k} tips={tips[k]} />);

    return <div className="tips-list">{tips}</div>
  }
}

class FileHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: 0
    };
  }

  render() {
    let fileTypes = [
      "bukkit.yml",
      "spigot.yml",
      "server.properties",
      "paper.yml"
    ];
    return (
      <div className="tip-file-header">
        {fileTypes.includes(this.props.file) ? <h5><FA icon="file-alt" /></h5> : null}

        <span>{this.props.file === "generic" ? "General Tips" : this.props.file}</span>

        {fileTypes.includes(this.props.file) ?
          <button href={fileTypes[this.props.file]} onClick={() => this.setState({ expanded: this.state.expanded ? 0 : 'auto' })}>
            {
              !this.state.expanded ?
                <div><FA icon="info-circle"></FA> How to change this</div> :
                <div>Close</div>
            }
          </button>
          : null}
        <AnimateHeight
          id='how-to-panel'
          duration={500}
          height={this.state.expanded} // see props documentation below
        >
          <ol>
            <li>Go to your server's control panel</li>
            <li>Open up the File Manager</li>
            <li>Open the <kbd>{this.props.file}</kbd> file</li>
            <li>Look for the setting you wish to change (you can press <kbd>CTRL-F</kbd> to find this)</li>
            <li>Edit the setting to the recommended value</li>
            <li>Click save</li>
            <li>Restart your server to reload the settings</li>
          </ol>
        </AnimateHeight>
      </div>
    );
  }
}

function TipCollection(props) {
  return (
    <div className="tip-file">
      <FileHeader file={props.file} />
      {props.tips.map(tip => <Tip tip={tip} key={tip.title} />)}
    </div>
  );
}

function TipHeader(props) {
  let color = colors[props.tip.type];
  return (
    <div className="tip-header" style={{
      borderBottom: `1px solid ${color}`,
      color
    }}>
      {props.tip.title}
    </div>
  );
}

function Tip(props) {
  let color = colors[props.tip.type];
  return (
    <div className="tip-item" style={{
      border: `1px solid ${color}`,
    }}>
      <TipHeader tip={props.tip} />
      {props.tip.desc}
    </div>
  )
}