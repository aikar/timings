<?php
/*
 * Aikar's Minecraft Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 * http://aikar.co
 * http://starlis.com
 *
 * @license MIT
 */
namespace Starlis\Timings\Json;
use Starlis\Timings\FromJson;

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
