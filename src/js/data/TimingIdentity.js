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

export default class TimingIdentity extends JsonObjectBase {

  /**
   * @type {int,string}
   */
  id;
  /**
   * @type string
   */
  name;
  /**
   * @type string
   */
  fullName;
  /**
   * @type int
   */
  group;
  /**
   * @type string
   */
  groupName;

  /**
   * @type TimingHandler
   */
  //_handler;
}
