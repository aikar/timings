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

export default class Region extends JsonTemplate {

	/**
	 * @type string
	 */
	regionId;

	/**
	 * @type World
	 */
	world;

	chunkCount;
	areaLocX;
	areaLocZ;

	/**
	 * @type int[]
	 */
	tileEntities;

	/**
	 * @type int[]
	 */
	entities;

}
