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

export default class TimingsMap extends JsonTemplate {

	/**
	 * @type {object<number,string>}
	 */
	groupMap;

	/**
	 * @type {object<number,TimingIdentity>}
	 */
	handlerMap;

	/**
	 * @type string[]
	 */
	worldMap;

	/**
	 * @type string[]
	 */
	tileEntityTypeMap;

	/**
	 * @type string[]
	 */
	entityTypeMap;

}
