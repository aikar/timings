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

export default class MinuteReport extends JsonObjectBase {
  /**
   * @type int
   */
  time;

  /**
   * @type float
   */
  tps;

  /**
   * @type float
   */
  avgPing;

  /**
   * @type TimingData
   */
  fullServerTick;
  /**
   * @type TicksRecord
   */
  ticks;
}
