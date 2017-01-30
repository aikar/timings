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

export default class TimingData extends JsonTemplate {

	mergedCount = 0;
	mergedLagCount = 0;
	/**
	 * @type TimingIdentity
	 */
	id;
	/**
	 * @type int
	 */
	count;
	/**
	 * @type int
	 */
	total;
	/**
	 * @type int
	 */
	lagCount;
	/**
	 * @type int
	 */
	lagTotal;

	addData(data) {
		this.mergedCount++;
		this.count += data.count;
		this.total += data.total;
		if (data.lagCount) {
			this.mergedLagCount++;
			this.lagCount += data.lagCount;
			this.lagTotal += data.lagTotal;
		}
	}
}
