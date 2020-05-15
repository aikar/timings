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

import xhr from "xhr";
import qs from "qs";
import query from './query';
import clone from "clone";
import _ from "lodash";
import ObjectManager from "objectsm";
import TimingData from "./data/TimingData";
import lscache from "ls-cache";
import World from "./data/World";
import Plugin from "./data/Plugin";
import TimingHandler from "./data/TimingHandler";
import MinuteReport from "./data/MinuteReport";
import TicksRecord from "./data/TicksRecord";
import TimingHistory from "./data/TimingHistory";
import TimingsSystemData from "./data/TimingsSystemData";
import TimingIdentity from "./data/TimingIdentity";
import Region from "./data/Region";
import TimingsMaster from "./data/TimingsMaster";
import TimingsMap from "./data/TimingsMap";


const TIMINGS_CLASS_MAP = {
  1: MinuteReport,
  2: Plugin,
  3: Region,
  4: TicksRecord,
  5: TimingData,
  6: TimingHandler,
  7: TimingHistory,
  8: TimingIdentity,
  9: TimingsMap,
  10: TimingsMaster,
  11: TimingsSystemData,
  12: World,
};
const timingsSerializer = new ObjectManager({
  mappings: TIMINGS_CLASS_MAP
});

let dataReadyCB = [];
let dataFailedCB = [];

lscache.enableWarnings();
const lastCacheVer = lscache.get("cache-ver");
if (lastCacheVer !== CACHE_VER) {
  lscache.flushRecursive();
}
lscache.set("cache-ver", CACHE_VER);

const TTL = 60*24*3;
const cache = lscache.createBucket(query.get('id') || "demo");

const data = {
  first: 0,
  /**
   * @type TimingHistory[]
   */
  history: [],
  ranges: [],
  start: 0,
  end: 3,
  maxTime: 1,
  stamps: [],
  lagData: [],
  tpsData: [],
  plaData: [],
  tentData: [],
  entData: [],
  chunkData: [],
};
data.hasFailed = false;
data.isReady = false;
data.isLoading = 0;

/**
 * @type {RegExp}
 */
data.nameFilter = "";

/**
 * @type {TimingsMaster}
 */
data.timingsMaster = null;
/**
 * @type {TimingHandler}
 */
data.masterHandler = null;
/**
 * @type {Object<number,TimingHandler>}
 */
data.handlerData = {};

const scales = data.scales = {
  "Entities": 10000,
  "Active Entities": 10000,
  "Tile Entities": 20000,
  "Chunks": 300,
  "Players": 100,
  "TPS": 25
};
const scalesCap = data.scalesCap = {
  "Entities": 15000,
  "Active Entities": 15000,
  "Tile Entities": 30000,
  "Chunks": 500,
  "Players": 300,
  "TPS": 25
};
const scaleMap = data.scaleMap = {
  "Entities": {},
  "Active Entities": {},
  "Tile Entities": {},
  "Chunks": {},
  "Players": {},
  "TPS": {}
};
data.labels = [];
data.loadData = async function loadData() {
  try {
    const cachedBody = cache.get("root");
    const [body] = (cachedBody && [cachedBody]) || await getData();
    if (!cachedBody) {
      cache.set("root", body, TTL);
    }

    for (const [key, value] of Object.entries(body)) {
      data[key] = value;
    }
    data.timingsMaster = await timingsSerializer.deserialize(data.timingsMaster); // process into object while its downloading
    if (data.end >= data.timingsMaster.data.length) {
      data.end = data.timingsMaster.data.length - 1;
    }

    data.history = data.timingsMaster.data;
    // repair motd if needed
    if (Array.isArray(data.timingsMaster.motd)) {
      data.timingsMaster.motd = data.timingsMaster.motd.join("\n");
    }
    let version = data.timingsMaster.version;
    // Support a bug in Sponge that serialized an optional
    if (!empty(version['value'])) {
      version = version['value'];
    }
    if (version === '$version') {
      version = "Sponge IDE Dev";
    }
    data.timingsMaster.version = version;

    let ranges = [];
    let first = -1;
    for (const /*TimingHistory*/history of data.timingsMaster.data) {
      ranges.push(history.start);
      ranges.push(history.end);
      if (first === -1 || first > history.start) {
        first = history.start;
      }
    }
    data.first = first;
    data.ranges = _.uniq(ranges);
    loadChartData();
    await loadTimingData();
    dataSuccess();
  } catch (e) {
    console.error(e);
  }
};
function loadChartData() {

  const first = data.first;
  data.lagData = [];
  data.tpsData = [];
  data.tentData = [];
  data.entData = [];
  data.aentData = [];
  data.chunkData = [];
  data.plaData = [];
  data.stamps = [];

  data.maxTime = 0;
  let totalChunkCount = 0;
  let totalPlayers = 0;
  const totalData = data.timingsMaster.data.length;
  for (const /*TimingHistory*/history of data.timingsMaster.data) {
    for (const /*World*/world of Object.values(history.worldData)) {
      for (const /*Region*/region of Object.values(world.regions)) {
        totalChunkCount += region.chunkCount;
      }
    }

    const firstMP = history.minuteReports[0];
    // I don't remember why we are doing this, but it obviously was to fix some
    // bug that i can't remember. It doesn't hurt, so just leave it here, unless
    // we really want to waste time debugging this more.
    for (let i = firstMP.time; i - first < 65; i += 60) {
      const copy = clone(firstMP, false);
      copy.time = first;
      history.minuteReports.unshift(copy);
    }

    for (const /*MinuteReport*/mp of history.minuteReports) {
      data.maxTime = max(mp.fullServerTick.total, data.maxTime);
      totalPlayers += mp.ticks.playerTicks / mp.ticks.timedTicks
    }
  }

  scalesCap.Chunks = ((totalChunkCount /totalData)*2);
  scales.Chunks = ((totalChunkCount /totalData)*1.5);
  scalesCap.Players = ((totalPlayers /totalData)*2);
  scales.Players = ((totalPlayers /totalData)*1.5);
  for (const /*TimingHistory*/history of data.timingsMaster.data) {
    let chunkCount = 0;
    for (const /*World*/world of Object.values(history.worldData)) {
      for (const /*Region*/region of Object.values(world.regions)) {
        chunkCount += region.chunkCount;
      }
    }
    for (const /*MinuteReport*/mp of history.minuteReports) {
      if (!mp.ticks.timedTicks) {
        continue;
      }

      data.stamps.push(mp.time);
      data.labels.push(new Date(mp.time * 1000).toLocaleString());
      data.tpsData.push(scale("TPS", mp.tps > 19.85 ? 20 : mp.tps));
      data.lagData.push(mp.fullServerTick.lagTotal);
      data.chunkData.push(scale("Chunks", chunkCount));
      data.entData.push(scale("Entities", mp.ticks.entityTicks / mp.ticks.timedTicks));
      data.plaData.push(scale("Players", mp.ticks.playerTicks / mp.ticks.timedTicks));
      data.aentData.push(scale("Active Entities", mp.ticks.activatedEntityTicks / mp.ticks.timedTicks));
      data.tentData.push(scale("Tile Entities", mp.ticks.tileEntityTicks / mp.ticks.timedTicks));
    }
  }
}

function scale(key, count) {
  //noinspection ES6ModulesDependencies,NodeModulesDependencies
  const res = (Math.min(scalesCap[key], count) / scales[key]) * data.maxTime;
  scaleMap[key][res] = count;
  return res;
}


let requestId = 0;
async function loadTimingData() {
  for (const history of data.history) {
    history.handlers = cache.get("history_" + history.id);
    if (history.handlers) {
      history.handlers = await timingsSerializer.deserialize(history.handlers);
    }
  }

  const neededIds = data.history
    .filter((h) => !h.handlers && h.id >= data.start && h.id <= data.end)
    .map((h) => h.id);
  requestId++;
  if (neededIds.length) {
    const thisRequest = requestId;
    for (const id of neededIds) {
      data.history[id].handlers = 1; // temp to block new requests for that ID
    }
    const [body] = await getData({
      history: neededIds.join(",")
    });

    for (const [key, history] of Object.entries(body.history)) {
      cache.set("history_" + key, history, TTL);
      data.history[key].handlers = await timingsSerializer.deserialize(history);
    }
    if (requestId !== thisRequest) {
      return; // A new request came in
    }
  }
  buildTimingData();
}
window.snapshot = (x) => {
	return JSON.parse(JSON.stringify(x));
}

function buildTimingData() {
  data.handlerData = {}; // Reset handler data
  const handlerData = data.handlerData;
  for (let i = data.start; i <= data.end; i++) {
    /**
     * @type TimingHandler[]
     */
    const handlers = data.history[i].handlers;
    //noinspection JSValidateTypes
    if (handlers === 1) {
      continue;
    }
    for (const /*TimingHandler*/handler of handlers) {
      const id = handler.id;
      if (!handlerData[id]) {
        handlerData[id] = new TimingHandler();
        handlerData[id].id = id;
     }
     handlerData[id].addDataFromHandler(handler);

    }
  }
  data.masterHandler = data.handlerData[1];
  data.changeOptions();
  buildSelfData();
  buildStats();

}

data.refresh = function () {
  (async () => {
    await loadTimingData();
    dataSuccess();
  })();
};

data.changeOptions = function (sort, type, refresh) {
  window.sortType = sort || sortType || 'totalPct';
  window.reportType = type || window.reportType || 'lag';
  if (window.reportType == 'lag' && !data.masterHandler['lagCount']) window.reportType = 'all';
  data.propTotal = prop('total');
  data.propCount = prop('count');
  data.totalTicks = data.masterHandler[data.propCount];
  data.totalTime = data.masterHandler[data.propTotal];

  if (refresh) {
    buildTimingData();
    dataSuccess();
  }

};

const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
data.setFilter = function (filterVal) {
  if (filterVal) {
    if (!filterVal.startsWith("!!")) {
      filterVal = filterVal.replace(matchOperatorsRe, '\\$&');
    } else {
      filterVal = filterVal.substring(2);
    }
  }
  data.nameFilter = (filterVal && new RegExp(filterVal, 'ig')) || "";
  dataSuccess();
};

function buildSelfData() {
  for (const [id, handler] of Object.entries(data.handlerData)) {

    const record = new TimingData();
    record.id = handler.id;
    record.isSelf = true;

    handler.childrenTotal = 0;
    handler.childrenLagTotal = 0;
    for (const child of Object.values(handler.children)) {
      handler.childrenTotal += child.total || 0;
      handler.childrenLagTotal += child.lagTotal || 0;
    }

    handler.childrenLagTotal = Math.min(handler.lagTotal, handler.childrenLagTotal);
    handler.childrenTotal = Math.min(handler.total, handler.childrenTotal);

    record.total = handler.total - handler.childrenTotal;
    record.lagTotal = handler.lagTotal - handler.childrenLagTotal;

    record.count = handler.count;
    record.lagCount = handler.lagCount;

    handler.children[id] = record;
  }
}

function buildStats() {
  for (const handler of Object.values(data.handlerData)) {
    for (const child of Object.values(handler.children)) {
      data.calculateStats(child);
    }
    data.calculateStats(handler);
  }

}
data.calculateStats = function calculateStats(handler) {
  const total = handler[data.propTotal];
  const count = handler[data.propCount];

  if (count === 0) {
    return;
  }

  handler.avg = (total / count);
  handler.tickAvg = (handler.avg / 1000000) * (count / data.totalTicks);
  handler.totalPct = (total / data.totalTime) * 100;
  handler.avgCountTick = count / data.totalTicks;
};

function getData(options = {}) {
  options.id = query.get('id') || "";

  return new Promise((resolve, reject) => {
    data.isLoading++;
    if (data.loadingIndicator) data.loadingIndicator.setState({loading: data.isLoading});
    xhr('data.php?' + qs.stringify(options), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "text",
      method: "GET",
    }, (err, res, body) => {
      data.isLoading--;
      if (data.loadingIndicator) data.loadingIndicator.setState({loading: data.isLoading});
      if (err || res.statusCode !== 200 || !body) {
        dataFailure();
        reject([err || res.statusText || "Status Code: " + res.statusCode, res]);
      } else {
        resolve([JSON.parse(body), res]);
      }
    })
  });
}

data.onFailure = function onFailure(cb) {
  if (data.hasFailed) {
    process.nextTick(() => cb());
  }
  dataFailedCB.push(cb);
};
data.onReady = function onReady(cb) {
  if (data.isReady) {
    process.nextTick(() => cb(data));
  }
  dataReadyCB.push(cb);
};

data.isDataReady = function isDataReady() {
  if (!timingsData || (Array.isArray(timingsData) && !timingsData.length)) {
    window.timingsData = null;
    return false;
  }
  return true;
};

function dataFailure() {
  data.hasFailed = true;
  dataFailedCB.forEach((cb) => cb());
}

function dataSuccess() {
  data.isReady = true;
  dataReadyCB.forEach((cb) => cb(data));
}

/**
 * @param {int} id
 * @returns {TimingIdentity}
 */
data.getIdentity = function (id) {
  return data.timingsMaster.idmap.handlerMap[id];
};

data.provideTo = function (comp) {
  if (!comp.isReactComponent) {
    throw new Error("Must be a react component");
  }
  if (!comp.state) {
    comp.state = {};
  }
  comp.state.timingHistoryReady = false;
  let hasUnmounted = false;
  const prevUnmount = comp.componentWillUnmount;
  comp.componentWillUnmount = function () {
    comp.componentWillUnmount = prevUnmount;
    hasUnmounted = true;
    if (prevUnmount) {
      prevUnmount.call(comp);
    }
  };
  data.onFailure(async () => {
    if (!hasUnmounted) {
      comp.setState({timingHistoryFailure: new Date()});
    }
  });
  data.onReady(async () => {
    if (!hasUnmounted) {
      comp.setState({timingHistoryReady: new Date()});
    }
  });
};


export default data;
