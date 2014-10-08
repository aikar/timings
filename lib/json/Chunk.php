<?php

/**
 * Spigot Timings Parser
 *
 * Written by Aikar <aikar@aikar.co>
 *
 * @license MIT
 */
class Chunk {
    use FromJson;

    /**
     * @index 0
     * @var int
     */
    public $chunkX;

    /**
     * @index 1
     * @var int
     */
    public $chunkZ;

    /**
     * @mapper chunkToBlock
     * @index 0
     * @var int
     */
    public $blockX;

    /**
     * @mapper chunkToBlock
     * @index 1
     * @var int
     */
    public $blockZ;

    /**
     * @mapper getTileEntityName
     * @index 3
     * @var int[]
     */
    public $tileEntities;

    /**
     * @mapper getEntityName
     * @index 4
     * @var int[]
     */
    public $entities;

    public static function chunkToBlock($i) {
        return $i << 4;
    }

    public static function getTileEntityName($count, FromJsonParent $parent) {
        $parent->name = TimingsMap::getTileEntityType($parent->name);
        return $count;
    }
    public static function getEntityName($count, FromJsonParent $parent) {
        $parent->name = TimingsMap::getEntityType($parent->name);
        return $count;
    }
}
