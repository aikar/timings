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

export default class MinuteReport extends ObjectBase {
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
