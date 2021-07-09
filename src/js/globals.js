/*
 * Copyright (c) (2017) - Aikar's Minecraft Timings Parser
 *
 *  Written by Aikar <aikar@aikar.co>
 *    + Contributors (See AUTHORS)
 * 
 *  Modified by PebbleHost
 *
 *  http://aikar.co
 *  http://starlis.com
 *
 *  @license MIT
 *
 */
import React from "react";
//import * as phpjs from "phpjs";
import data from "./data";

window.data = data;

window.prop = function prop(type) {
  if (reportType === 'lag') {
    return type === 'total' ? 'lagTotal' : 'lagCount';
  } else {
    return type === 'total' ? 'total' : 'count';
  }
};

window.lagFilter = function lagFilter(propTotal, propCount, useNameFilter) {
  return (handler) => {
    if (!handler) {
      return false;
    }

    let avg = 0;
    const count = handler[propCount];
    const total = handler[propTotal];
    /*if (count > 0) {
     avg = (total / count) * handler.mergedCount;
     }*/
    if (total < 5) {
      return false;
    }
    if (!useNameFilter || !data.nameFilter) {
      return true;
    }
    const id = data.getIdentity(handler.id);
    return id && data.nameFilter.test(id.fullName);
  }
};

const replacements = [
  [/net\.minecraft\.server\.v[^.]+\./, 'nms.'],
  [/org\.bukkit\.craftbukkit\.v[^.]+\./, 'obc.'],
];
window.cleanName = function cleanName(name) {
  const orig = name;
  for (const pattern of replacements) {
    name = name.replace(pattern[0], pattern[1]);
  }
  name = name.replace(/Event: ([a-zA-Z0-9.]+) /, condensePackage);
  return <span title={orig}>{name}</span>;
};
window.condensePackage = function condensePackage(pkg) {
  let name = pkg.substring(7).split(/\./);
  const last = name.pop();
  name = name.map((v) => v[0]);
  name.push(last);
  return 'Event: ' + name.join(".") + ' ';
};

window.pctView = function pctView(val, t1 = 25, t2 = 15, t3 = 5, t4 = 1) {
  return pctViewMod(val, 1, t1, t2, t3, t4);
};
window.pctViewMod = function pctViewMod(val, mod = 1, t1 = 25, t2 = 15, t3 = 5, t4 = 1) {
  let valNum = parseFloat(val).toFixed(2);
  val *= mod;
  if (val > t1) {
    valNum = <span className='warn-high'>{valNum}</span>;
  } else if (val > t2) {
    valNum = <span className='warn-med'>{valNum}</span>;
  } else if (val > t3) {
    valNum = <span className='warn-low'>{valNum}</span>;
  } else if (val > t4) {
    valNum = <span className='warn-none'>{valNum}</span>;
  }

  return valNum;
};

window.round = function round(number, decimals) {
  return parseFloat(number).toFixed(decimals);
};

window.waitFor = function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

window.reportType = 'lag';
window.sortType = 'totalPct';