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

import {ObjectBase} from "objectsm";;

export default class TimingData extends ObjectBase {

  mergedCount = 0;
  mergedLagCount = 0;
  /**
   * @type int
   */
  id;
  /**
   * @type int
   */
  count = 0;
  /**
   * @type int
   */
  total = 0;
  /**
   * @type int
   */
  lagCount = 0;
  /**
   * @type int
   */
  lagTotal = 0;

  addData(data) {
    this.mergedCount++ ;

    this.count += data.count || 0;
    this.total += data.total || 0;
    if (data.lagCount) {
      this.mergedLagCount++;
      this.lagCount += data.lagCount || 0;
      this.lagTotal += data.lagTotal || 0;
    }
  }
}
