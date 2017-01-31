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

export default class JsonTemplate {
	_rawData;
	_deferDecoding = false;

	async decode() { /* abstract - will be injected from JsonObject */}
	rawData() { /* abstract - will be injected from JsonObject */}
	init() { };

	constructor() {}
}
