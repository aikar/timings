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

export default class TimingsSystemData extends ObjectBase {

  timingcost;
  loadavg;
  name;
  version;
  jvmversion;
  jvmvendor;
  jvmvendorversion;
  arch;
  maxmem;
  cpu;
  cpuname;
  runtime;
  flags;
  gc;
}
