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

import TimingData from "./TimingData";
import clone from "clone";

export default class TimingHandler extends TimingData {
  constructor() {
    super();
    //this._deferDeserializing = true; // TODO: defer this later when we move to client parsing
  }

  /**
   * @type {object<int, TimingData>}
   */
  children = {};
  // Maintain stats on children to calculate self
  childrenCount = 0;
  childrenTotal = 0;
  childrenLagCount = 0;
  childrenLagTotal = 0;

  onSerialize() {
    super.onDeserialize();
    this.id = parseInt(this.id);
    const children = this.children;
    this.children = {};
    for (const child of Object.values(children)) {
      this.children[child.id] = child;
    }
  }

  /**
   *
   * @param {TimingHandler} handler
   */
  addDataFromHandler(handler) {
    if (handler.id !== this.id) {
      throw new Error("WTF!");
    }
    this.addData(handler);
    for (const child of Object.values(handler.children)) {
      const id = child.id;


      if (this.children[id]) {
        this.children[id].addData(child);
      } else {
        this.children[id] = clone(child, false);
      }
    }
  }
}
