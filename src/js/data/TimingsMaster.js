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

export default class TimingsMaster extends JsonTemplate {

	version;
	maxplayers;
	start;
	end;
	sampletime;

	// <privacy false>
	server;
	motd;
	onlinemode;
	icon;
	// </privacy false>

	/**
	 * @type TimingsSystemData
	 */
	system;

	/**
	 * @type TimingsMap
	 */
	idmap;

	/**
	 * @type Plugin[]
	 */
	plugins;

	/**
	 * @type TimingHistory[]
	 */
	data;

	/**
	 * @type array[]
	 */
	config;
}
