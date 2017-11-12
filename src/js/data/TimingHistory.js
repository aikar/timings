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

import {JsonObjectBase} from "jsonobject";

export default class TimingHistory extends JsonObjectBase {

  /**
   * @type int
   */
  id;

  /**
   */
  start;

  /**
   * @type int
   */
  end;

  /**
   * @type int
   */
  totalTicks;

  /**
   * @type int
   */
  totalTime;

  /**
   * @type TimingHandler[]
   */
  handlers;

  /**
   * @type World[]
   */
  worldData;
  /**
   * @type MinuteReport[]
   */
  minuteReports;
}
