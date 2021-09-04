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

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import React from 'react';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import TimingsChartOptions from './TimingsChartOptions';
import * as keyFile from '../amcharts';

// Install am4core themes & license key
am4core.useTheme(am4themes_dark);
if (keyFile.key) am4core.addLicense(keyFile.key);

export default class TimingsChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      seriesEnabled: {},
      seriesObjects: {}
    }

    this.toggleSeries = this.toggleSeries.bind(this);
  }

  disableSeries(id) {
    let series = this.state.seriesObjects[id];
    if (this.state.seriesEnabled[id]) {
      series.hide();
      this.setState({
        seriesEnabled: {
          ...this.state.seriesEnabled,
          [id]: false,
        }
      });
    }
  }

  enableSeries(id) {
    let series = this.state.seriesObjects[id];
    if (!this.state.seriesEnabled[id]) {
      series.show();
      this.setState({
        seriesEnabled: {
          ...this.state.seriesEnabled,
          [id]: true,
        }
      });
    }
  }

  toggleSeries(id) {
    if (this.state.seriesEnabled[id]) this.disableSeries(id);
    else this.enableSeries(id);
  }

  /**
   * 
   * @param {am4core.LineSeries} series 
   */
  configureSeries(series, fill, stroke) {
    series.dataFields.dateX = "time";
    series.strokeWidth = 3;
    series.minBulletDistance = 15;
    series.fill = am4core.color(fill)
    series.stroke = am4core.color(stroke)
    series.yAxis.min = 0;
    series.yAxis.cursorTooltipEnabled = false;
    series.tensionX = 0.9;

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color(stroke);

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;
  }

  componentDidMount() {
    let chart = am4core.create("timings-graph", am4charts.XYChart);

    chart.paddingRight = 20;

    chart.data = this.props.data.labels.map((label, i) => {
      return {
        time: label,
        tps: this.props.data.scaleMap.TPS[this.props.data.tpsData[i]],
        players: Math.round(this.props.data.scaleMap.Players[this.props.data.plaData[i]]),
        tpsLoss: Math.round(100 * (this.props.data.lagData[i] / this.props.data.maxTime)),
        entities: Math.round(this.props.data.scaleMap.Entities[this.props.data.entData[i]]),
        tileEntities: Math.round(this.props.data.scaleMap["Tile Entities"][this.props.data.tentData[i]]),
        chunks: Math.round(this.props.data.scaleMap.Chunks[this.props.data.chunkData[i]])
      };
    });

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.cursorTooltipEnabled = false;
    for (const period of [
      "millisecond",
      "second",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "year"
    ]) dateAxis.dateFormats.setKey(period, "MMM dt, H:mm");


    let tpsAxis = chart.yAxes.push(new am4charts.ValueAxis());
    tpsAxis.tooltip.hidden = true;
    tpsAxis.hidden = true;
    tpsAxis.maxWidth = 0;

    let tpsSeries = chart.series.push(new am4charts.LineSeries());
    tpsSeries.dataFields.dateX = "time";
    tpsSeries.dataFields.valueY = "tps";
    tpsSeries.dataFields.playersValueY = "players";
    tpsSeries.dataFields.tpsLossValueY = "tpsLoss";
    tpsSeries.dataFields.entitiesValueY = "entities";
    tpsSeries.dataFields.tileEntitiesValueY = "tileEntities";
    tpsSeries.dataFields.chunksValueY = "chunks";
    tpsSeries.tooltipHTML = "<div style='text-align: left;'>\
      TPS: {valueY}<br>\
      Players: {playersValueY}<br>\
      TPS Loss: {tpsLossValueY}%<br>\
      Entities: {entitiesValueY}<br>\
      Tile Entities: {tileEntitiesValueY}\
    </div>";
    tpsSeries.tooltip.background.fill = am4core.color("#222");
    tpsSeries.tooltip.background.cornerRadius = 0;
    tpsSeries.tooltip.background.stroke = am4core.color("#2190d4");
    tpsSeries.tooltip.background.strokeOpacity = 1;
    tpsSeries.tooltip.fontWeight = 100;
    tpsSeries.tooltip.stroke = am4core.color("#fff");
    tpsSeries.tooltip.getStrokeFromObject = true;
    tpsSeries.tooltip.background.strokeWidth = 3;
    tpsSeries.tooltip.getFillFromObject = false;
    tpsSeries.fillOpacity = 0.8;
    tpsSeries.stacked = true;
    tpsSeries.yAxis = tpsAxis;
    tpsSeries.bulletsContainer.parent = chart.seriesContainer;
    this.configureSeries(tpsSeries, "rgba(171, 255, 168, 0.8)", "#2190d4a0");
    tpsSeries.strokeWidth = 2;

    let playersAxis = chart.yAxes.push(new am4charts.ValueAxis());
    playersAxis.tooltip.hidden = true;
    playersAxis.hidden = true;
    playersAxis.maxWidth = 0;
    let playersSeries = chart.series.push(new am4charts.LineSeries());
    playersSeries.dataFields.valueY = "players";
    playersSeries.yAxis = playersAxis;
    this.configureSeries(playersSeries, "rgba(0,0,0,0)", "#4F80FF");

    let tpsLossAxis = chart.yAxes.push(new am4charts.ValueAxis());
    tpsLossAxis.tooltip.hidden = true;
    tpsLossAxis.hidden = true;
    tpsLossAxis.maxWidth = 0;
    tpsLossAxis.max = 100;
    let tpsLossSeries = chart.series.push(new am4charts.LineSeries());
    tpsLossSeries.dataFields.valueY = "tpsLoss";
    tpsLossSeries.fillOpacity = 0.7;
    tpsLossSeries.yAxis = tpsLossAxis;
    this.configureSeries(tpsLossSeries, "rgba(255, 142, 1, 0.8)", "rgba(255,60,60,1)");

    let entitiesAxis = chart.yAxes.push(new am4charts.ValueAxis());
    entitiesAxis.tooltip.hidden = true;
    entitiesAxis.hidden = true;
    entitiesAxis.maxWidth = 0;
    let entitiesSeries = chart.series.push(new am4charts.LineSeries());
    entitiesSeries.dataFields.valueY = "entities";
    entitiesSeries.yAxis = entitiesAxis;
    this.configureSeries(entitiesSeries, "rgba(0,0,0,0)", "#84E2FF");

    let tileEntitiesAxis = chart.yAxes.push(new am4charts.ValueAxis());
    tileEntitiesAxis.tooltip.hidden = true;
    tileEntitiesAxis.hidden = true;
    tileEntitiesAxis.maxWidth = 0;
    let tileEntitiesSeries = chart.series.push(new am4charts.LineSeries());
    tileEntitiesSeries.dataFields.valueY = "tileEntities";
    tileEntitiesSeries.yAxis = tileEntitiesAxis;
    this.configureSeries(tileEntitiesSeries, "rgba(0,0,0,0)", "#DBF76A");

    let chunksAxis = chart.yAxes.push(new am4charts.ValueAxis());
    chunksAxis.tooltip.hidden = true;
    chunksAxis.hidden = true;
    chunksAxis.maxWidth = 0;
    let chunksSeries = chart.series.push(new am4charts.LineSeries());
    chunksSeries.dataFields.valueY = "chunks";
    chunksSeries.yAxis = chunksAxis;
    this.configureSeries(chunksSeries, "rgba(0,0,0,0)", "#9324B5");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "none";

    this.setState({
      seriesObjects: {
        tps: tpsSeries,
        tpsLoss: tpsLossSeries,
        players: playersSeries,
        entities: entitiesSeries,
        tileEntities: tileEntitiesSeries,
        chunks: chunksSeries
      },
      seriesEnabled: {
        tps: true,
        tpsLoss: true,
        players: true,
        entities: true,
        tileEntities: true,
        chunks: true
      }
    });

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) this.chart.dispose();
  }

  render() {
    return (
      <div>
        <TimingsChartOptions {...this.state.seriesEnabled} toggle={this.toggleSeries} />
        <div id="timings-graph" style={{ width: "100%", height: "400px" }}></div>
      </div>
    );
  }
}
