<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */


class HandlerGroup {
	use FromJson;

	/**
	 * @index @key
	 */
	public $name;

	/**
	 * @var string[]
	 */
	public $handlers;
} 
