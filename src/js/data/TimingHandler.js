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

import TimingData from "./TimingData";

export default class TimingHandler extends TimingData {

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
