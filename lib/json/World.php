<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class World {
    use FromJson;

    /**
     * @mapper TimingsMap::getWorldName
     * @index @key
     * @var string
     */
    public $worldName;

    /**
     * @index @value
     * @var Chunk[]
     */
    public $chunks;

}
