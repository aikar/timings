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

import JsonTemplate from "./JsonTemplate";

export default class TimingsSystemData extends JsonTemplate {

	timingcost;
	name;
	version;
	arch;
	totalmem;
	usedmem;
	maxmem;
	cpu;
	runtime;
}
