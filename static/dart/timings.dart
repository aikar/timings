/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar    <aikar@aikar.co>
 *            DemonWav <demonwav@demonwav.com>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */

import 'dart:html';
import 'dart:async';
import 'dart:convert';
import 'package:chart/chart.dart';
import 'package:js/js.dart' as js;

import 'util.dart';

Map _data = {};
List _values = [];
List _labels = [];
Map _scales = {};

void main() {
  // TODO: use the old method for now, not this. Implement this later
  HttpRequest.getString("" /* TODO: get correct URL here */).then((response) {
    try {
      _data = JSON.decode(response);
    } catch (e) {
      _data = {
        "ranges": [],
        "start": 1,
        "end": 1,
        "maxTime": 1
      };
    }

    _values = _data["ranges"];
    _scales = {
      "Entities": 10000,
      "Tile Entities": 25000,
      "Chunks": 3000,
      "Players": 100,
      "TPS": 20
    };

    initializeData();
    initializeChart();
    initializeTimeSelector();

    Timer.run(initializeAds);

    initializeCollapseControls();

//    checkHashLoc();
  });
}

void initializeData() {
  List<num> stamps = _data["stamps"] as List<num>;
  for (int i = 0; i < stamps.length; i++) {
    DateTime d = new DateTime.fromMillisecondsSinceEpoch(stamps[i] * 1000);
    _labels.add(d.toString());
  }

  List<num> tpsData = _data["tpsData"] as List<num>;
  for (int i = 0; i < tpsData.length; i++) {
    tpsData[i] = (tpsData[i] / _scales["TPS"]) * _data["maxTime"];
  }

  List<num> plaData = _data["plaData"] as List<num>;
  for (int i = 0; i < plaData.length; i++) {
    plaData[i] = (plaData[i] / _scales["Players"]) * _data["maxTime"];
  }

  List<num> tentData = _data["tentData"] as List<num>;
  for (int i = 0; i < tentData.length; i++) {
    tentData[i] = (tentData[i] / _scales["Tile Entities"]) * _data["maxTime"];
  }

  List<num> entData = _data["entData"] as List<num>;
  for (int i = 0; i < entData.length; i++) {
    entData[i] = (entData[i] / _scales["Entities"]) * _data["maxTime"];
  }

  List<num> chunkData = _data["chunkData"] as List<num>;
  for (int i = 0; i < chunkData.length; i++) {
    chunkData[i] = (chunkData[i] / _scales["Chunks"]) * _data["maxTime"];
  }
}

void initializeChart() {
  // I assume this port of chartjs will handle a normal dart map here. We'll see.
  Line line = new Line({
    "labels": _labels,
    "datasets": [
      {
        "data": [_data["maxTime"]],
        "PointDotRadius": 0,
        "pointStrokeWidth": 0
      },
      {
        "label": "TPS",
        //fillColor: "rgba(145,255,156,.6)",
        //fillColor: htorgba("136b06", .8),
        "fillColor": htorgba("#ABFFA8", .8),
        "strokeColor": "rgba(16,109,47,.7)",
        "pointColor": "rgba(16,109,47,.7)",
        "pointStrokeColor": "#fff",
        "pointHighlightFill": "#fff",
        "pointHighlightStroke": "rgba(220,220,220,1)",
        "data": _data["tpsData"]
      }, {
        "label": "LAG",
        //fillColor: htorgba("8d0707",0.8),
        "fillColor": htorgba("ff8e01", 0.8),
        "strokeColor": "rgba(255,60,60,1)",
        "pointColor": "rgba(255,60,60,1)",
        "pointStrokeColor": "#ff5533",
        "pointHighlightFill": "#ff5533",
        "pointHighlightStroke": "rgba(151,187,205,1)",
        "data": _data["lagData"]
      },
      {
        "label": "Players",
        "fillColor": "rgba(0,0,0,0)",
        "pointColor": "#4F80FF",
        "pointStrokeColor": "#DBF76A",
        "data": _data["plaData"]
      },
      {
        "label": "Tile Entities",
        "fillColor": "rgba(0,0,0,0)",
        "pointColor": "#DBF76A",
        "pointStrokeColor": "#DBF76A",
        "data": _data["tentData"]
      },
      {
        "label": "Entities",
        "fillColor": "rgba(0,0,0,0)",
        "pointColor": "#84E2FF",
        "pointStrokeColor": "#84E2FF",
        "data": _data["entData"]
      },
      {
        "label": "Chunks",
        "fillColor": "rgba(0,0,0,0)",
        "pointColor": "#9324B5",
        "pointStrokeColor": "#9324B5",
        "data": _data["chunkData"]
      }
    ]
  }, {
    "animation": false,
    "legendTemplate": "",
    "showScale": false,
    "pointHitDetectionRadius": 2,
    "responsive": true,
    "maintainAspectRatio": false,
    // I assume this dart port of chartjs will handle a dart function. We'll see.
    "multiTooltipTemplate": (v) {
      if (v.datasetLabel == "LAG") {
        return ((v.value / _data["maxTime"]) * 100).round() + "% TPS Loss";
      } else {
        return ((v.value / _data["maxTime"] * _scales[v.datasetLabel] * 100).round() / 100) + " " + v.datasetLabel;
      }
    }
  });
}

void initializeTimeSelector() {
  int start = _data["start"];
  int end = _data["end"];

  List<String> times = [];
  for (String t in _values) {
    if (times.indexOf(t) == -1) {
      times.add(t);
    }
  }

  var timeSelector = js.context.$("#time-selector");
  timeSelector.slider({
    "min": 0,
    "max": times.length - 1,
    // TODO: I don't think this will work with how package:js takes complex types
    // TODO: Also, indexOf() doesn't take integers, figure out what to do here instead
    "values": [times.indexOf(start), times.indexOf(end)],
    "range": true,
    // TODO: package:js doesn't take dart functions like this (afaik). Will probably have to do something different
    "slide": (event, ui) {
      start = times[ui.values[0]];
      end = times[ui.values[1]];
      updateRanges(start, end);
    }
  });

  Timer timer = null;

  void clearRedirectTimer() {
    if (timer != null) {
      timer.cancel();
    }
  }

  void redirectToNewTimeRange() {
    clearRedirectTimer();
    timer = new Timer(new Duration(milliseconds: 1500), () {
      // TODO: I absolutely know there's no way this can work, but hey, who knows it might. Fix when it doesn't
      js.context.window.location = js.context.$.query.set("start", start).set("end", end).toString();
    });
  }

  timeSelector.on("slidestart", clearRedirectTimer);
  timeSelector.on("slidechange", redirectToNewTimeRange);

  updateRanges(start, end);
}

void initializeCollapseControls() {
  ElementList<Element> timingChildren = querySelectorAll(".full-timing-row .children");

  timingChildren.forEach((e) {
    e.parent.querySelector(" > .name").insertAdjacentHtml("beforeBegin", "<div class='expand-control'>[+]</div> ");

    Element control = e.parent.querySelector(" > .expand-control");
    subscriptions[control] = control.onClick.listen(collapseTimings);
  });
}
