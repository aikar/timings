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
import clone from "clone";

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


	/**
	 *
	 * @param {TimingHandler} handler
	 */
	addDataFromHandler(handler) {
		this.addData(handler);
		for (const child of handler.children) {
			const id = child.id.id;

			if (this.children[id]) {
				this.children[id].addData(child);
			} else {
				this.children[id] = clone(child);
			}
		}
	}
}
