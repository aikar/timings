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

export default class TimingsSystemData extends JsonObjectBase {

  timingcost;
  name;
  version;
  jvmversion;
  arch;
  maxmem;
  cpu;
  runtime;
  flags;
  gc;
}
