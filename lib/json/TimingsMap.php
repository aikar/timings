<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */


class TimingsMap {
	use FromJson;
	/**
	 * @index handlers
	 * @var HandlerGroup[]
	 */
	public $handlerMap;

	/**
	 * @index worlds
	 * @var string[]
	 */
	public $worldMap;

	/**
	 * @index tileentity
	 * @var string[]
	 */
	public $tileEntityTypeMap;

	/**
	 * @index entity
	 * @var string[]
	 */
	public $entityTypeMap;
} 
