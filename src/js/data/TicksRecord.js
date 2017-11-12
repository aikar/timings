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

export default class TicksRecord extends JsonObjectBase {

  /**
   * @type int
   */
  timedTicks;
  /**
   * @type int
   */
  playerTicks;
  /**
   * @type int
   */
  entityTicks;
  /**
   * @type int
   */
  activatedEntityTicks;
  /**
   * @type int
   */
  tileEntityTicks;
}
