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

import React from 'react';
import FA from './FA';

const TimingsBadge = (props) => {
  return (
    <div className={"timings-chart-badge " + props.optionId} onClick={() => props.toggle(props.optionId)}>
      <div className="left">{props.optionName}</div>
      <div className="right"><FA icon={props.enabled ? 'check' : 'times'} /></div>
    </div>
  );
};

const TimingsChartOptions = props => (
  <div className="timings-chart-options">
    <TimingsBadge optionName="TPS Loss" optionId="tpsLoss" enabled={props.tpsLoss} toggle={props.toggle} />
    <TimingsBadge optionName="Players" optionId="players" enabled={props.players} toggle={props.toggle} />
    <TimingsBadge optionName="Entities" optionId="entities" enabled={props.entities} toggle={props.toggle} />
    <TimingsBadge optionName="Tile Entities" optionId="tileEntities" enabled={props.tileEntities} toggle={props.toggle} />
    <TimingsBadge optionName="Chunks" optionId="chunks" enabled={props.chunks} toggle={props.toggle} />
  </div>
);
export default TimingsChartOptions;
