<?php
/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */


class HandlerGroupMap {
    use FromJson;

    /**
	 * @index @key
	 */
    public $name;

    /**
     * @index @value
     * @var string[]
     */
    public $handlers;
} 
