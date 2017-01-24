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

export default class TimingHandler extends JsonTemplate {

	/**
	 * @type TimingData[]
	 */
	children;
	// Maintain stats on children to calculate self
	childrenCount = 0;
	childrenTotal = 0;
	childrenLagCount = 0;
	childrenLagTotal = 0;
}
