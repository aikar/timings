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

export default class TimingIdentity extends JsonTemplate {

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
	group;

	/**
	 * @type TimingHandler
	 */
	//_handler;
}
